# Importações Externas
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from collections.abc import AsyncGenerator

# Importações Internas
from app.database import SessionLocal
from app.services.principal import usuarioService

from app.schemas.principal.usuario import UsuarioCreate, UsuarioLogin, UsuarioUpdate, UsuarioRead
from app.schemas.principal.filtro import ConsultaFiltradaRequest
from app.schemas.shared.response import ResponseModel

from app.auth.security import verificar_senha
from app.auth.auth import criar_token
from app.auth.dependencies import obter_usuario_atual


# Rota
router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)


# Dependência de sessão assíncrona
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

# ------------------------------------------------------------------------- #
#                              ENDPOINTS                                    #
# ------------------------------------------------------------------------- #


@router.post("/login", response_model=ResponseModel[dict])
async def login(dados: UsuarioLogin, db: AsyncSession = Depends(get_db)):
    usuario = await usuarioService.buscar_com_filtros(
        db, [{"coluna": "login", "valor": dados.login, "filtro": "="}]
    )

    usuario = usuario[0] if usuario else None

    if not usuario or not verificar_senha(dados.senha, usuario.senha):
        raise HTTPException(status_code=401, detail="Credenciais inválidas")

    token = criar_token({"sub": usuario.login})

    return ResponseModel(
        status="success",
        mensagem="Login realizado com sucesso.",
        dados={
            "access_token": token,
            "token_type": "bearer"
        }
    )



@router.get("/me")
async def me(usuario_logado=Depends(obter_usuario_atual)):
    """
    Retorna os dados do usuário atualmente autenticado.

    ## Parâmetros
    - `usuario_logado`: Usuário autenticado, injetado automaticamente via `Depends`.

    ## Retorna
    - `dict`: Dicionário com os dados do usuário logado.
    """
    return {"usuario": usuario_logado}


@router.post("/", response_model=ResponseModel[UsuarioRead])
async def criar_usuario(
    dados: UsuarioCreate,
    db: AsyncSession = Depends(get_db)
) -> ResponseModel[UsuarioRead]:
    """
    Cria um novo usuário no sistema.

    ## Parâmetros
    - `dados`: Objeto com os dados do usuário (nome, login, senha, etc), validado por `UsuarioCreate`.
    - `db`: Sessão de banco de dados injetada automaticamente via `Depends(get_db)`.

    ## Retorna
    - `ResponseModel[UsuarioRead]`: Dados do usuário criado, status da operação e mensagem.
    """
    usuario = await usuarioService.criar(db, dados)
    return ResponseModel(
        status="success",
        mensagem="Usuário criado com sucesso.",
        dados=usuario
    )


@router.get("/", response_model=ResponseModel[list[UsuarioRead]])
async def listar_usuarios(db: AsyncSession = Depends(get_db)) -> ResponseModel[list[UsuarioRead]]:
    """
    Lista todos os usuários cadastrados.

    ## Parâmetros
    - `db`: Sessão assíncrona do banco de dados.

    ## Retorna
    - `ResponseModel[list[UsuarioRead]]`: Lista de usuários cadastrados.
    """
    usuarios = await usuarioService.listar(db)
    
    mensagem = "Usuários consultados com sucesso!" if usuarios else "Nenhum usuário encontrado."
    
    return ResponseModel(
        status="success",
        mensagem=mensagem,
        dados=usuarios
    )


@router.get("/{usuario_id}", response_model=ResponseModel[UsuarioRead])
async def buscar_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db)
) -> ResponseModel[UsuarioRead]:
    """
    Busca um usuário pelo ID.

    ## Parâmetros
    - `usuario_id`: Identificador único do usuário.
    - `db`: Sessão assíncrona do banco de dados.

    ## Retorna
    - `ResponseModel[UsuarioRead]`: Dados do usuário encontrado, ou 404 se não existir.
    """
    usuario = await usuarioService.buscar(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return ResponseModel(
        status="success",
        mensagem=None,
        dados=usuario
    )


@router.put("/{usuario_id}", response_model=ResponseModel[UsuarioRead])
async def atualizar_usuario(
    usuario_id: int,
    dados: UsuarioUpdate,
    db: AsyncSession = Depends(get_db)
) -> ResponseModel[UsuarioRead]:
    """
    Atualiza os dados de um usuário existente.

    ## Parâmetros
    - `usuario_id`: ID do usuário a ser atualizado.
    - `dados`: Campos a serem atualizados (validados via `UsuarioUpdate`).
    - `db`: Sessão assíncrona do banco de dados.

    ## Retorna
    - `ResponseModel[UsuarioRead]`: Usuário atualizado ou 404 se não encontrado.
    """
    usuario = await usuarioService.atualizar(db, usuario_id, dados)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return ResponseModel(
        status="success",
        mensagem="Usuário atualizado com sucesso.",
        dados=usuario
    )


@router.delete("/{usuario_id}", response_model=ResponseModel[dict])
async def remover_usuario(
    usuario_id: int,
    db: AsyncSession = Depends(get_db)
) -> ResponseModel[dict]:
    """
    Remove um usuário do banco de dados.

    ## Parâmetros
    - `usuario_id`: ID do usuário a ser removido.
    - `db`: Sessão assíncrona do banco de dados.

    ## Retorna
    - `ResponseModel[dict]`: Mensagem de sucesso ou 404 se o usuário não existir.
    """
    sucesso = await usuarioService.remover(db, usuario_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return ResponseModel(
        status="success",
        mensagem="Usuário removido com sucesso.",
        dados={"id": usuario_id}
    )


@router.post("/consulta_filtrada", response_model=ResponseModel[list[UsuarioRead]])
async def buscar_usuarios_filtrados(
    dados: ConsultaFiltradaRequest,
    db: AsyncSession = Depends(get_db)
) -> ResponseModel[list[UsuarioRead]]:
    """
    Realiza busca de usuários com filtros dinâmicos.

    ## Parâmetros
    - `dados`: Objeto contendo filtros, ordenação, colunas desejadas e limite.
    - `db`: Sessão assíncrona do banco de dados.

    ## Retorna
    - `ResponseModel[list[UsuarioRead]]`: Lista de usuários encontrados conforme os critérios informados.
    """

    # Passo 1: Acessar a lista de filtros do objeto Pydantic (ConsultaFiltradaRequest)
    # Neste ponto, dados.filtros é uma lista de objetos do tipo `Filtro`, não um dicionário puro
    filtros_objetos = dados.filtros  # Pode ser None ou lista de Filtro

    # Passo 2: Converter os objetos Pydantic (Filtro) para dicionários padrão Python (dict)
    # Isso é necessário porque o repositório espera `list[dict[str, object]]`, não objetos Filtro
    filtros_dict = [filtro.model_dump() for filtro in filtros_objetos] if filtros_objetos else None

    # Passo 3: Chamar o service, repassando os dados transformados e os demais parâmetros
    usuarios = await usuarioService.buscar_com_filtros(
        db=db,
        filtros=filtros_dict,
        ordenacao=dados.ordenacao,
        colunas=dados.colunas,
        limite=dados.limite
    )

    # Passo 4: Retornar os dados dentro do ResponseModel padronizado para a API
    return ResponseModel(
        status="success",
        mensagem=None,
        dados=usuarios
    )


