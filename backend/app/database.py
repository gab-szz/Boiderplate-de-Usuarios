from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base

# URL para SQLite async
DATABASE_URL = "sqlite+aiosqlite:///./usuarios.db"

# Engine assíncrono
engine = create_async_engine(DATABASE_URL, echo=True)

# Session assíncrona
SessionLocal = async_sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)

# Base dos modelos
Base = declarative_base()
