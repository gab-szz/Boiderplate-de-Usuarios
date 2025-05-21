from sqlalchemy import Column, ForeignKey, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base

class perfilpermissaoModel(Base):
    __tablename__ = "perfilpermissao"

    id_perfil = Column(Integer, ForeignKey("perfil.id"), primary_key=True)
    id_permissao = Column(Integer, ForeignKey("permissao.id"), primary_key=True)

    perfil = relationship(
        "perfilModel",
        back_populates="permissoes"
    )
    permissao = relationship(
        "permissaoModel",
        back_populates="perfis"
    )
