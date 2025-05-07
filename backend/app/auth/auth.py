from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

# Chave secreta para assinar o token JWT
SECRET_KEY = "a56sdax1sa6s5d4a1sxaa45sd56a4sd46azx1as4d8d41c1gfd"
# Algoritmo de assinatura
ALGORITHM = "HS256"
# Tempo de expiração do token em minutos
EXPIRES_MINUTES = 180

def criar_token(dados: dict) -> str:
    """
    Gera um token JWT assinado com base nos dados fornecidos.

    Args:
        dados (dict): Dados a serem incluídos no payload do token.

    Returns:
        str: Token JWT assinado, contendo os dados e uma data de expiração.
    """
    to_encode = dados.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=EXPIRES_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verificar_token(token: str):
    """
    Verifica e decodifica um token JWT.

    Args:
        token (str): Token JWT a ser verificado.

    Returns:
        dict | None: Payload decodificado se o token for válido, ou None se inválido ou expirado.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
