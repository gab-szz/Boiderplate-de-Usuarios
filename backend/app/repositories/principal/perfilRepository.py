# app/repositories/principal/perfilRepository.py

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.principal.perfilModel import perfilModel
from app.schemas.principal.perfil import PerfilCreate, PerfilUpdate
from app.repositories.generic import consulta_filtrada


async def criar_perfil(db: AsyncSession, dados: PerfilCreate) -> perfilModel:
    novo = perfilModel(**dados.model_dump())
    db.add(novo)
    await db.commit()
    await db.refresh(novo)
    return novo


async def listar_perfis(db: AsyncSession) -> list[perfilModel]:
    resultado = await db.execute(select(perfilModel))
    return resultado.scalars().all()


async def buscar_perfil_por_id(db: AsyncSession, perfil_id: int) -> perfilModel | None:
    resultado = await db.execute(select(perfilModel).where(perfilModel.id == perfil_id))
    return resultado.scalar_one_or_none()


async def buscar_perfis_com_filtros(
    db: AsyncSession,
    filtros: list[dict[str, object]] | list[list] | None = None,
    ordenacao: list[str] | None = None,
    colunas: list[str] | None = None,
    limite: int = 25,
) -> list[perfilModel]:
    return await consulta_filtrada(db, perfilModel, filtros, ordenacao, colunas, limite)


async def atualizar_perfil(db: AsyncSession, perfil_id: int, dados: PerfilUpdate) -> perfilModel | None:
    perfil = await buscar_perfil_por_id(db, perfil_id)
    if not perfil:
        return None

    dados_dict = dados.model_dump(exclude_unset=True)
    for campo, valor in dados_dict.items():
        setattr(perfil, campo, valor)

    await db.commit()
    await db.refresh(perfil)
    return perfil


async def deletar_perfil(db: AsyncSession, perfil_id: int) -> bool:
    perfil = await buscar_perfil_por_id(db, perfil_id)
    if not perfil:
        return False

    await db.delete(perfil)
    await db.commit()
    return True