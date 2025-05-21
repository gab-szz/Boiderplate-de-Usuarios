from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime, timezone
from app.database import Base
from sqlalchemy.orm import relationship

class permissaoModel(Base):
    __tablename__ = "permissao"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    descricao = Column(String, nullable=False)

    perfis = relationship(
        "perfilpermissaoModel",
        back_populates="permissao",
        cascade="all, delete-orphan"
    )
