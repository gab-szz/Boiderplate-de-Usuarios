from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from app.models.principal.usuarioModel import UsuarioModel
from app.schemas.principal.usuarios import UsuarioCreate, UsuarioUpdate

async def criar_usuario(db: AsyncSession, dados: UsuarioCreate) -> UsuarioModel:
    novo = UsuarioModel(**dados.dict())
    db.add(novo)
    await db.commit()
    await db.refresh(novo)
    return novo

async def listar_usuarios(db: AsyncSession) -> list[UsuarioModel]:
    resultado = await db.execute(select(UsuarioModel))
    return resultado.scalars().all()

async def buscar_usuario_por_id(db: AsyncSession, usuario_id: int) -> UsuarioModel | None:
    resultado = await db.execute(
        select(UsuarioModel).where(UsuarioModel.id == usuario_id)
    )
    return resultado.scalar_one_or_none()

async def atualizar_usuario(db: AsyncSession, usuario_id: int, dados: UsuarioUpdate) -> UsuarioModel | None:
    usuario = await buscar_usuario_por_id(db, usuario_id)
    if not usuario:
        return None

    for key, value in dados.dict(exclude_unset=True).items():
        setattr(usuario, key, value)

    await db.commit()
    await db.refresh(usuario)
    return usuario

async def deletar_usuario(db: AsyncSession, usuario_id: int) -> bool:
    usuario = await buscar_usuario_por_id(db, usuario_id)
    if not usuario:
        return False

    await db.delete(usuario)
    await db.commit()
    return True
