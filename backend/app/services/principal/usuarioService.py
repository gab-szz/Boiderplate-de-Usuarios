import re
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.principal.usuarios import UsuarioCreate, UsuarioUpdate
from app.repositories.principal import usuarioRepository
from app.entities.principal.usuarioEntity import UsuarioEntity
from app.exceptions.regra_negocio import RegraNegocioException


def _to_entity(modelo) -> UsuarioEntity:
    """
    Converte um modelo ORM para uma entidade de domínio.

    Parâmetros:
        modelo: Objeto ORM do usuário retornado pelo repositório.

    Retorna:
        UsuarioEntity: Entidade de domínio com os campos mapeados.
    """
    return UsuarioEntity(
        id=modelo.id,
        nome=modelo.nome,
        login=modelo.login,
        perfil=modelo.perfil,
        data_criacao=modelo.data_criacao,
    )
    

async def criar_usuario(db: AsyncSession, 
                        dados: UsuarioCreate
                        ) -> UsuarioEntity:
    """
    Cria um novo usuário no banco de dados.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        dados (UsuarioCreate): Dados validados do novo usuário.

    Retorna:
        UsuarioEntity: Entidade de domínio representando o usuário criado.
    """
    if not re.match(r"^[a-zA-Z0-9]{3,}\.[a-zA-Z0-9]{3,}$", dados.login):
        raise RegraNegocioException("O login deve conter um ponto e pelo menos 6 caracteres.")
    
    UsuarioModel = await usuarioRepository.criar_usuario(db, dados)
    return _to_entity(UsuarioModel)


async def buscar_usuario_pela_id(db: AsyncSession, 
                         usuario_id: int) -> UsuarioEntity | None:
    """
    Busca um usuário pelo seu ID.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        usuario_id (int): Identificador do usuário.

    Retorna:
        UsuarioEntity | None: Entidade do usuário ou None se não encontrado.
    """
    model = await usuarioRepository.buscar_usuario_por_id(db, usuario_id)
    return _to_entity(model) if model else None


async def listar_usuarios(db: AsyncSession
                          ) -> list[UsuarioEntity]:
    """
    Lista todos os usuários cadastrados.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.

    Retorna:
        list[UsuarioEntity]: Lista de entidades de usuários.
    """
    usuarios_model = await usuarioRepository.listar_usuarios(db)
    return [_to_entity(usuario) for usuario in usuarios_model]


async def buscar_usuarios_com_filtros(db: AsyncSession, 
                                      filtros: list[dict[str, object]] | list[list] | None = None,
                                      ordenacao: list[str] | None = None,
                                      colunas: list[str] | None = None,
                                      limite: int = 25,
                                      ) -> list[UsuarioEntity]:
    """
    Busca usuários com filtros padronizados.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        usuario_id (int): Identificador do usuário.

    Retorna:
        UsuarioEntity | None: Entidade do usuário ou None se não encontrado.
    """
    usuarios_model = await usuarioRepository.buscar_usuarios_com_filtros(db, filtros, ordenacao, colunas, limite)
    return [_to_entity(usuario) for usuario in usuarios_model]


async def atualizar_usuario(db: AsyncSession, 
                            usuario_id: int, 
                            dados: UsuarioUpdate) -> UsuarioEntity | None:
    """
    Atualiza os dados de um usuário existente.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        usuario_id (int): ID do usuário a ser atualizado.
        dados (UsuarioUpdate): Dados atualizados validados.

    Retorna:
        UsuarioEntity | None: Entidade atualizada ou None se não encontrado.
    """
    usuarioModelo = await usuarioRepository.atualizar_usuario(db, usuario_id, dados)
    return _to_entity(usuarioModelo) if usuarioModelo else None


async def remover_usuario(db: AsyncSession, usuario_id: int) -> bool:
    """
    Remove um usuário do banco de dados.

    Parâmetros:
        db (AsyncSession): Sessão assíncrona do banco de dados.
        usuario_id (int): ID do usuário a ser removido.

    Retorna:
        bool: True se removido com sucesso, False caso contrário.
    """
    return await usuarioRepository.deletar_usuario(db, usuario_id)
