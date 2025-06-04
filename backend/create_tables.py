# test_create.py
from app.database import Base, engine
from app.models.principal.usuarioModel import UsuarioModel
from app.models.principal.perfilModel import perfilModel
from app.models.principal.perfilpermissaoModel import perfilpermissaoModel
from app.models.principal.permissaoModel import permissaoModel

import asyncio

async def testar_criacao():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

asyncio.run(testar_criacao())


