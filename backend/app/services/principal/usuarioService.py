from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.principal.usuarios import UsuarioCreate, UsuarioUpdate
from app.repositories.principal import usuarioRepository
from app.entities.principal.usuarioEntity import UsuarioEntity

async def criar_usuario(db: AsyncSession, dados: UsuarioCreate) -> UsuarioEntity:
    model = await usuarioRepository.criar_usuario(db, dados)
    return _to_entity(model)

async def listar_usuarios(db: AsyncSession) -> list[UsuarioEntity]:
    modelos = await usuarioRepository.listar_usuarios(db)
    return [_to_entity(u) for u in modelos]

async def buscar_usuario(db: AsyncSession, usuario_id: int) -> UsuarioEntity | None:
    model = await usuarioRepository.buscar_usuario_por_id(db, usuario_id)
    return _to_entity(model) if model else None

async def atualizar_usuario(db: AsyncSession, usuario_id: int, dados: UsuarioUpdate) -> UsuarioEntity | None:
    model = await usuarioRepository.atualizar_usuario(db, usuario_id, dados)
    return _to_entity(model) if model else None

async def remover_usuario(db: AsyncSession, usuario_id: int) -> bool:
    return await usuarioRepository.deletar_usuario(db, usuario_id)

def _to_entity(modelo) -> UsuarioEntity:
    return UsuarioEntity(
        id=modelo.id,
        nome=modelo.nome,
        login=modelo.login,
        perfil=modelo.perfil,
        data_criacao=modelo.data_criacao,
    )
