from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.auth.auth import verificar_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    return payload  # Ou carregue do banco via ID do payload
