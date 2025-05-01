from typing import Generic, TypeVar, Optional
from pydantic import BaseModel

T = TypeVar("T")

class ResponseModel(BaseModel, Generic[T]):
    status: str  # "success" | "error"
    mensagem: Optional[str] = None
    dados: Optional[T] = None