# app/schemas/usuarios.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

# Base: campos comuns
class UsuarioBase(BaseModel):
    nome: str
    login: str
    perfil: str

# Para criar: herda base + senha obrigatória
class UsuarioCreate(UsuarioBase):
    senha: str

# Para ler/retornar: inclui id e data
class UsuarioRead(BaseModel):
    id: int
    nome: str
    login: str
    perfil: str
    data_criacao: datetime

    model_config = ConfigDict(from_attributes=True)

# Para editar: todos opcionais
class UsuarioUpdate(BaseModel):
    nome: Optional[str] = None
    login: Optional[str] = None
    senha: Optional[str] = None
    perfil: Optional[str] = None
