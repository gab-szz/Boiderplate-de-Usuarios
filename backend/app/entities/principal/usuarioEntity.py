# app/entities/usuarioEntity.py

from datetime import datetime

class UsuarioEntity:
    def __init__(
        self,
        id: int,
        nome: str,
        login: str,
        perfil: str,
        email: str,
        senha: str,
        ativo: bool,
        data_criacao: datetime,
    ):
        self.id = id
        self.nome = nome
        self.login = login
        self.perfil = perfil
        self.email = email
        self.senha = senha
        self.ativo = ativo
        self.data_criacao = data_criacao

    def is_active(self) -> bool:
        """Retorna True se o usuário está ativo"""
        return self.ativo

    def email_valido(self) -> bool:
        """Valida formato básico de email (simples)"""
        return "@" in self.email and "." in self.email