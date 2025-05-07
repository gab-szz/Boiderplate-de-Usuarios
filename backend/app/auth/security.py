from passlib.context import CryptContext

# Contexto de criptografia utilizando o algoritmo bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verificar_senha(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica se a senha fornecida corresponde ao hash armazenado.

    Args:
        plain_password (str): Senha em texto plano fornecida pelo usuário.
        hashed_password (str): Hash da senha armazenada no banco de dados.

    Returns:
        bool: True se a senha for válida, False caso contrário.
    """
    return pwd_context.verify(plain_password, hashed_password)


def gerar_hash_senha(password: str) -> str:
    """
    Gera um hash seguro para uma senha utilizando bcrypt.

    Args:
        password (str): Senha em texto plano a ser criptografada.

    Returns:
        str: Hash criptografado da senha.
    """
    return pwd_context.hash(password)
