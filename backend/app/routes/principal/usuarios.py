from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from collections.abc import AsyncGenerator
from app.database import SessionLocal
from app.schemas.principal.usuarios import UsuarioCreate, UsuarioUpdate, UsuarioRead
from app.services.principal import usuarioService
from app.schemas.shared.response import ResponseModel

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)

# Dependência de sessão assíncrona
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session


@router.post("/", response_model=ResponseModel[UsuarioRead])
async def criar_usuario(dados: UsuarioCreate, db: AsyncSession = Depends(get_db)):
    usuario = await usuarioService.criar_usuario(db, dados)
    return ResponseModel(
        status="success",
        mensagem="Usuário criado com sucesso.",
        dados=usuario
    )


@router.get("/", response_model=ResponseModel[list[UsuarioRead]])
async def listar_usuarios(db: AsyncSession = Depends(get_db)):
    usuarios = await usuarioService.listar_usuarios(db)
    return ResponseModel(
        status="success",
        mensagem=None,
        dados=usuarios
    )


@router.get("/{usuario_id}", response_model=ResponseModel[UsuarioRead])
async def buscar_usuario(usuario_id: int, db: AsyncSession = Depends(get_db)):
    usuario = await usuarioService.buscar_usuario(db, usuario_id)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return ResponseModel(
        status="success",
        mensagem=None,
        dados=usuario
    )


@router.put("/{usuario_id}", response_model=ResponseModel[UsuarioRead])
async def atualizar_usuario(usuario_id: int, dados: UsuarioUpdate, db: AsyncSession = Depends(get_db)):
    usuario = await usuarioService.atualizar_usuario(db, usuario_id, dados)
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return ResponseModel(
        status="success",
        mensagem="Usuário atualizado com sucesso.",
        dados=usuario
    )


@router.delete("/{usuario_id}", response_model=ResponseModel[dict])
async def remover_usuario(usuario_id: int, db: AsyncSession = Depends(get_db)):
    sucesso = await usuarioService.remover_usuario(db, usuario_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return ResponseModel(
        status="success",
        mensagem="Usuário removido com sucesso.",
        dados={"id": usuario_id}
    )
