from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.principal.usuarioModel import UsuarioModel
from backend.app.schemas.principal.usuario import UsuarioCreate, UsuarioUpdate
from app.repositories.generic import consulta_filtrada


async def criar_usuario(db: AsyncSession, 
                        dados: UsuarioCreate
                        ) -> UsuarioModel:
    """
    Cria um novo registro de usuário no banco de dados.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        dados (UsuarioCreate): Dados do novo usuário validados via Pydantic.

    Retorna:
        UsuarioModel: Instância do modelo recém-criada e atualizada.
    """
    
    usuario_dict = dados.model_dump()
    novo_usuario = UsuarioModel(**usuario_dict)
    
    db.add(novo_usuario)
    await db.commit()
    await db.refresh(novo_usuario)  # Atualiza com dados gerados no banco (ex: ID gerado)
    return novo_usuario

  
async def listar_usuarios(db: AsyncSession
                          ) -> list[UsuarioModel]:
    """
    Retorna todos os usuários cadastrados.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Retorna:
        list[UsuarioModel]: Lista de objetos de modelo representando os usuários.
    """
    resultado = await db.execute(select(UsuarioModel))
    return resultado.scalars().all()


async def buscar_usuario_por_id(db: AsyncSession, 
                                usuario_id: int
                                ) -> UsuarioModel | None:
    """
    Busca um usuário pelo ID.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        usuario_id (int): Identificador único do usuário.

    Retorna:
        UsuarioModel | None: Usuário encontrado ou None se não existir.
    """
    resultado = await db.execute(
        select(UsuarioModel).where(UsuarioModel.id == usuario_id)
    )
    return resultado.scalar_one_or_none()


async def buscar_usuarios_com_filtros(
    db: AsyncSession,
    filtros: list[dict[str, object]] | list[list] | None = None,
    ordenacao: list[str] | None = None,
    colunas: list[str] | None = None,
    limite: None = 25,
) -> list[UsuarioModel]:
    """
    Busca usuários com base em filtros dinâmicos reutilizando a função genérica.

    Parâmetros:
        db: Sessão assíncrona do banco.
        filtros: Lista de dicionários com filtros (coluna, valor, operador, etc).
        ordenacao: Lista como ["nome ASC", "id DESC"].
        colunas: Lista de colunas para carregamento otimizado (opcional).

    Retorna:
        Lista de usuários encontrados conforme os filtros aplicados.
    """
    return await consulta_filtrada(db, UsuarioModel, filtros, ordenacao, colunas, limite)
    

async def atualizar_usuario(db: AsyncSession, 
                            usuario_id: int, 
                            novos_dados: UsuarioUpdate
                            ) -> UsuarioModel | None:
    """
    Atualiza os dados de um usuário existente.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        usuario_id (int): ID do usuário a ser atualizado.
        dados (UsuarioUpdate): Campos atualizados do usuário (validados via Pydantic).

    Retorna:
        UsuarioModel | None: Modelo atualizado ou None se o usuário não existir.
    """
    usuario = await buscar_usuario_por_id(db, usuario_id)
    if not usuario:
        return None

    novos_dados_dict = novos_dados.model_dump(exclude_unset=True)
    
    for coluna, valor in novos_dados_dict.items():
        setattr(usuario, coluna, valor)

    await db.commit()
    await db.refresh(usuario)
    return usuario


async def deletar_usuario(db: AsyncSession, 
                          usuario_id: int
                          ) -> bool:
    """
    Remove um usuário do banco de dados.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        usuario_id (int): ID do usuário a ser removido.

    Retorna:
        bool: True se removido com sucesso, False se o usuário não foi encontrado.
    """
    usuario = await buscar_usuario_por_id(db, usuario_id)
    if not usuario:
        return False

    await db.delete(usuario)
    await db.commit()
    return True
