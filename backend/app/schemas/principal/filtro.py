# app/schemas/comum/filtros.py
from pydantic import BaseModel
from typing import Any, Literal

class Filtro(BaseModel):
    coluna: str
    valor: Any
    filtro: Literal["=", "!=", ">", "<", ">=", "<=", "like", "ilike", "in"] = "="
    ou: bool = False

class ConsultaFiltradaRequest(BaseModel):
    filtros: list[Filtro] | list[list[Filtro]] | None = None
    ordenacao: list[str] | None = None
    colunas: list[str] | None = None
    limite: int = 25
