# app/exceptions/regra_negocio.py
class RegraNegocioException(Exception):
    def __init__(self, mensagem: str):
        self.mensagem = mensagem
        super().__init__(mensagem)
