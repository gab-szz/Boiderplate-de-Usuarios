from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database import Base, engine
from app.models.principal.usuarioModel import UsuarioModel
from app.routes.principal.usuarios import router as usuario_router
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from app.schemas.shared.response import ResponseModel    
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Antes de iniciar o servidor
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Aqui você poderia fazer algo ao desligar o app (fechar conexões, etc)
    
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ou ["*"] para testes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
# já dentro do lifespan...
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=ResponseModel(
            status="error",
            mensagem="Houve um problema na validação dos campos, verifique os dados enviados e tente novamente.",
            dados=exc.errors()  # ou exc.body para mostrar os dados enviados
        ).model_dump()
    )


@app.exception_handler(IntegrityError)
async def db_integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content=ResponseModel(
            status="error",
            mensagem="Erro de integridade do banco.",
            dados=str(exc.orig)  # ou extrair info específica
        ).model_dump()
    )


# Rotas
app.include_router(usuario_router)
