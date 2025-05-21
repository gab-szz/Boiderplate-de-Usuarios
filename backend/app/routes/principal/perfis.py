
# Importações Externas
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from collections.abc import AsyncGenerator

# Importações Internas
from app.database import SessionLocal

from app.schemas.principal.filtro import ConsultaFiltradaRequest
from app.schemas.shared.response import ResponseModel

from app.schemas.principal.perfil import PerfilCreate, PerfilRead
from app.services.principal import perfilService


# Rota
router = APIRouter(
    prefix="/perfis",
    tags=["Perfil", "Perfis"]
)


# Dependência de sessão assíncrona
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


@router.get("/", response_model=ResponseModel[list[PerfilRead]])
async def listar_perfis(db: AsyncSession = Depends(get_db)):
    perfis = await perfilService.listar(db)
    return ResponseModel(status="success", mensagem=None, dados=perfis)


@router.post("/", response_model=ResponseModel[PerfilRead])
async def criar_perfil(dados: PerfilCreate, db: AsyncSession = Depends(get_db)):
    perfil = await perfilService.criar(db, dados)
    return ResponseModel(status="success", mensagem="Perfil criado", dados=perfil)
