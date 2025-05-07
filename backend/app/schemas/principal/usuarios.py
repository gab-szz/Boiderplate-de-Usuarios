from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional
from datetime import datetime

# Base: campos comuns
class UsuarioBase(BaseModel):
    nome: str = Field(..., min_length=6, max_length=100)
    login: str = Field(..., min_length=4)
    perfil: str = Field(..., min_length=3)
    email: EmailStr
    ativo: bool = True  # ← padrão é ativo ao criar

# Para criar: herda base + senha obrigatória
class UsuarioCreate(UsuarioBase):
    senha: str = Field(..., min_length=6)

# Para ler/retornar: inclui id e data
class UsuarioRead(BaseModel):
    id: int
    nome: str
    login: str
    perfil: str
    email: EmailStr
    ativo: bool
    data_criacao: datetime

    model_config = ConfigDict(from_attributes=True)

# Para editar: todos opcionais
class UsuarioUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=6)
    login: Optional[str] = Field(None, min_length=4)
    senha: Optional[str] = Field(None, min_length=6)
    perfil: Optional[str] = Field(None, min_length=3)
    email: Optional[EmailStr] = None
    ativo: Optional[bool] = None


class UsuarioLogin(BaseModel):
    """
    Schema para autenticação de usuário (login).
    """
    login: str = Field(..., min_length=4, description="Login do usuário.")
    senha: str = Field(..., min_length=6, description="Senha do usuário.")