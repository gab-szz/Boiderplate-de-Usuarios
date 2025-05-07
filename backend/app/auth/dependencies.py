from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.auth.auth import verificar_token

# Define o esquema de autenticação OAuth2, usando o endpoint /login para obter tokens
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

async def obter_usuario_atual(token: str = Depends(oauth2_scheme)):
    """
    Recupera o usuário atual com base no token JWT fornecido no cabeçalho Authorization.

    Este método depende do OAuth2PasswordBearer para extrair o token do cabeçalho Authorization.
    Em seguida, utiliza a função `verificar_token` para decodificar e validar o JWT.

    Args:
        token (str): Token JWT extraído automaticamente pelo FastAPI via OAuth2.

    Returns:
        dict: Payload do token JWT se válido, contendo as informações do usuário.

    Raises:
        HTTPException: Retorna 401 (Unauthorized) se o token for inválido ou ausente.
    """
    print(token)
    payload = verificar_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")
    return payload  # Opcional: você pode buscar o usuário no banco com o ID dentro do payload
