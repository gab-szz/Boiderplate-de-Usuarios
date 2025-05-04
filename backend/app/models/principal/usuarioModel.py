from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime, timezone
from app.database import Base

class UsuarioModel(Base):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    login = Column(String, unique=True, index=True, nullable=False)
    senha = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)         # ← novo campo
    ativo = Column(Boolean, default=True, nullable=False)       # ← novo campo
    perfil = Column(String, nullable=False)
    data_criacao = Column(DateTime, default=lambda: datetime.now(timezone.utc))
