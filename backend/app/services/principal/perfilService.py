# app/services/principal/perfilService.py

from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.principal.perfil import PerfilCreate, PerfilUpdate
from app.repositories.principal import perfilRepository
from app.entities.principal.perfilEntity import PerfilEntity
from app.models.principal.perfilModel import perfilModel


def _to_entity(modelo: perfilModel) -> PerfilEntity:
    return PerfilEntity(
        id=modelo.id,
        nome=modelo.nome,
        descricao=modelo.descricao
    )


async def criar(db: AsyncSession, dados: PerfilCreate) -> PerfilEntity:
    model = await perfilRepository.criar_perfil(db, dados)
    return _to_entity(model)


async def listar(db: AsyncSession) -> list[PerfilEntity]:
    modelos = await perfilRepository.listar_perfis(db)
    return [_to_entity(p) for p in modelos]


async def buscar_por_id(db: AsyncSession, perfil_id: int) -> PerfilEntity | None:
    model = await perfilRepository.buscar_perfil_por_id(db, perfil_id)
    return _to_entity(model) if model else None


async def buscar_com_filtros(
    db: AsyncSession,
    filtros: list[dict[str, object]] | list[list] | None = None,
    ordenacao: list[str] | None = None,
    colunas: list[str] | None = None,
    limite: int = 25,
) -> list[PerfilEntity]:
    modelos = await perfilRepository.buscar_perfis_com_filtros(db, filtros, ordenacao, colunas, limite)
    return [_to_entity(p) for p in modelos]


async def atualizar(db: AsyncSession, perfil_id: int, dados: PerfilUpdate) -> PerfilEntity | None:
    model = await perfilRepository.atualizar_perfil(db, perfil_id, dados)
    return _to_entity(model) if model else None


async def remover(db: AsyncSession, perfil_id: int) -> bool:
    return await perfilRepository.deletar_perfil(db, perfil_id)
