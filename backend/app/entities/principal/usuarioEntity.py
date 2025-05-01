# app/entities/usuarioEntity.py

from datetime import datetime

class UsuarioEntity:
    def __init__(self, id: int, nome: str, login: str, perfil: str, data_criacao: datetime):
        self.id = id
        self.nome = nome
        self.login = login
        self.perfil = perfil
        self.data_criacao = data_criacao

    def exibir_nome_formatado(self) -> str:
        return self.nome.title()
