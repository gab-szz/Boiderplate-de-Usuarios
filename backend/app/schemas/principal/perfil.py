from pydantic import BaseModel, ConfigDict


class PerfilBase(BaseModel):
    nome: str
    descricao: str


class PerfilCreate(PerfilBase):
    pass


class PerfilRead(PerfilBase):
    id: int

    model_config = ConfigDict(from_attributes=True)


class PerfilUpdate(BaseModel):
    nome: str | None = None
    descricao: str | None = None
