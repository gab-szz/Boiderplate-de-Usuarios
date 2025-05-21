from fastapi import FastAPI, HTTPException
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.requests import Request
from sqlalchemy.exc import IntegrityError
from fastapi.middleware.cors import CORSMiddleware
import re

# Schemas e handlers
from app.schemas.shared.response import ResponseModel
from app.exceptions.regra_negocio import RegraNegocioException

# Banco de dados
from app.database import Base, engine
from app.models.principal.usuarioModel import UsuarioModel  # apenas para registrar o modelo
from app.routes.principal.usuarios import router as usuario_router
from app.routes.principal.perfis import router as perfil_router
from app.utils.fastLog import log

log.info("Iniciando aplicação")

# -------------------------------------------------------------------
# Ciclo de vida da aplicação (lifespan): criar e dropar tabelas etc.
# -------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # aqui poderia fechar conexões, limpar cache, etc.

app = FastAPI(lifespan=lifespan)

# -------------------------------------------------------------------
# CORS
# -------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ajuste conforme necessário
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------------
# Handlers globais de exceções
# -------------------------------------------------------------------

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Erros de validação automática do Pydantic (campos faltando, tipos errados, etc.).
    Padroniza cada erro no formato:
    {
      "campo": "<nome_do_campo>",
      "mensagem": "<mensagem_de_erro>",
      "tipo": "<tipo_de_erro>"
    }
    """
    erros_formatados = []
    for err in exc.errors():
        loc = err.get("loc", [])
        # remove "body" e une o restante por ponto
        campo = ".".join(str(x) for x in loc[1:]) if len(loc) > 1 else loc[-1]
        erros_formatados.append({
            "campo": campo,
            "mensagem": err.get("msg"),
            "tipo": err.get("type")
        })

    return JSONResponse(
        status_code=422,
        content=ResponseModel(
            status="error",
            mensagem="Houve um problema na validação dos campos, verifique os dados enviados e tente novamente.",
            dados=erros_formatados
        ).model_dump()
    )


@app.exception_handler(IntegrityError)
async def db_integrity_error_handler(request: Request, exc: IntegrityError):
    """
    Violação de restrição de integridade do banco (ex: UNIQUE, FK, NOT NULL).
    Formata a saída em lista de erros no padrão:
    [
      { "campo": "<nome_do_campo>", "mensagem": "<msg>", "tipo": "<tipo>" }
    ]
    """
    msg_original = str(exc.orig)
    erros_formatados = []

    # Detecta UNIQUE constraint
    unique_match = re.search(
        r"UNIQUE constraint failed: [\w\.]+\.([\w]+)",
        msg_original
    )
    if unique_match:
        campo = unique_match.group(1)
        erros_formatados.append({
            "campo": campo,
            "mensagem": f"Já existe um registro com esse {campo}.",
            "tipo": "unique"
        })
    else:
        # fallback genérico
        erros_formatados.append({
            "campo": None,
            "mensagem": msg_original,
            "tipo": "integrity_error"
        })

    return JSONResponse(
        status_code=400,
        content=ResponseModel(
            status="error",
            mensagem="Erro de integridade do banco.",
            dados=erros_formatados
        ).model_dump()
    )


@app.exception_handler(RegraNegocioException)
async def regra_negocio_exception_handler(request: Request, exc: RegraNegocioException):
    """
    Erros de regra de negócio esperados (ex: formatação de login, business logic).
    """
    return JSONResponse(
        status_code=200,
        content=ResponseModel(
            status="error",
            mensagem=exc.mensagem,
            dados=None
        ).model_dump()
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Tratamento padronizado para HTTPException levantadas manualmente nos endpoints.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content=ResponseModel(
            status="error",
            mensagem=exc.detail,
            dados=None
        ).model_dump()
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """
    Captura quaisquer exceções não tratadas explicitamente acima.
    """
    return JSONResponse(
        status_code=500,
        content=ResponseModel(
            status="error",
            mensagem="Erro interno no servidor.",
            dados=None  # ou str(exc) em debug
        ).model_dump()
    )

# -------------------------------------------------------------------
# Registro das rotas (endpoints)
# -------------------------------------------------------------------
app.include_router(usuario_router)
app.include_router(perfil_router)

log.info("Aplicação Iniciada!")
