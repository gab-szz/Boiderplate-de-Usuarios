from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime, timezone
from app.database import Base
from sqlalchemy.orm import relationship

class perfilModel(Base):
    __tablename__ = "perfil"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    descricao = Column(String, nullable=False)

    permissoes = relationship(
        "perfilpermissaoModel",
        back_populates="perfil",
        cascade="all, delete-orphan"
    )
