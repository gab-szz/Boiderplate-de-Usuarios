from datetime import datetime, timedelta
from jose import jwt, JWTError

SECRET_KEY = "sua_chave_secreta_super_segura"
ALGORITHM = "HS256"
EXPIRES_MINUTES = 60

def criar_token(dados: dict) -> str:
    to_encode = dados.copy()
    expire = datetime.utcnow() + timedelta(minutes=EXPIRES_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def verificar_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
