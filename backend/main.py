from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware

# Schemas e handlers
from app.schemas.shared.response import ResponseModel    
from app.exceptions.regra_negocio import RegraNegocioException

# Banco de dados
from app.database import Base, engine
from app.models.principal.usuarioModel import UsuarioModel  # Opcional: apenas para registrar o modelo
from app.routes.principal.usuarios import router as usuario_router

# -------------------------------------------------------------------
# Ciclo de vida da aplicação (lifespan): executa ações ao iniciar ou encerrar o app
# -------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Executado antes do servidor subir:
    # Garante que as tabelas estejam criadas no banco
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Executado ao desligar o servidor:
    # Aqui você poderia fechar conexões, limpar cache, etc.

# Instancia o FastAPI com suporte ao ciclo de vida personalizado
app = FastAPI(lifespan=lifespan)

# -------------------------------------------------------------------
# Middleware de CORS: libera requisições de outras origens (ex: frontend em React)
# -------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Use ["*"] para testes sem restrições
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Handlers globais de exceções
# -------------------------------------------------------------------

# Erros de validação automática (ex: campo ausente ou tipo inválido)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content=ResponseModel(
            status="error",
            mensagem="Houve um problema na validação dos campos, verifique os dados enviados e tente novamente.",
            dados=exc.errors()  # Ou use exc.body para exibir o conteúdo enviado
        ).model_dump()
    )

# Violação de restrição no banco de dados (ex: chave duplicada, FK inválida)
@app.exception_handler(IntegrityError)
async def db_integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content=ResponseModel(
            status="error",
            mensagem="Erro de integridade do banco.",
            dados=str(exc.orig)  # Detalhes do erro original
        ).model_dump()
    )

# Erros de regra de negócio definidos pela aplicação (ex: login inválido)
@app.exception_handler(RegraNegocioException)
async def regra_negocio_exception_handler(request: Request, exc: RegraNegocioException):
    return JSONResponse(
        status_code=200,  # Considerado erro "esperado", não técnico
        content=ResponseModel(
            status="error",
            mensagem=exc.mensagem,
            dados=None
        ).model_dump()
    )

# -------------------------------------------------------------------
# Registro das rotas (endpoints)
# -------------------------------------------------------------------
app.include_router(usuario_router)
