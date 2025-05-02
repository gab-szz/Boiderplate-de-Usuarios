from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from sqlalchemy.orm import load_only


async def consulta_filtrada(
    sessao: AsyncSession,
    modelo: type,
    filtros: list[dict[str, object]] | list[list] | None = None,
    ordenacao: list[str] | None = None,
    colunas: list[str] | None = None,
    limite: int = 25,
) -> list[object]:
    """
    Busca registros de forma genérica usando filtros dinâmicos, ordenação,
    seleção de colunas e limite de resultados, compatível com AsyncSession
    e ORM 2.0 do SQLAlchemy.

    Parâmetros:
        sessao: Sessão assíncrona do banco de dados.
        modelo: Classe ORM (declarativa) representando a tabela.
        filtros: Lista de dicionários ou sublistas de filtros, ex:
            [
                {"coluna": "nome", "valor": "Maria", "filtro": "ilike", "ou": False},
                [
                    {"coluna": "status", "valor": "ativo", "filtro": "="}
                ]
            ]
            Pode conter {"limite": int} para definir quantos registros retornar.
        ordenacao: Lista de strings "coluna ASC|DESC", ex: ["nome ASC", "id DESC"].
        colunas: Lista de nomes de atributos para carregamento otimizado.

    Retorna:
        Lista de instâncias do modelo que atendem aos critérios.
    """
    # 1. Normaliza filtros
    if filtros is None:
        filtros = []
    elif not isinstance(filtros, list):
        filtros = [filtros]

    # 3. Monta a consulta base
    stmt = select(modelo)

    # 3.1. Se houver colunas específicas, aplica load_only()
    if colunas:
        validas = [c for c in colunas if hasattr(modelo, c)]
        if validas:
            stmt = stmt.options(load_only(*validas))

    # 4. Processa filtros recursivamente
    def processar(grupo: list) -> object | None:
        ands: list = []
        ors: list = []

        for f in grupo:
            if isinstance(f, list):
                sub = processar(f)
                if sub is not None:
                    ands.append(sub)
                continue

            col = f.get("coluna")
            val = f.get("valor")
            op = f.get("filtro", "=").lower()
            use_or = f.get("ou", False)

            if not col or not hasattr(modelo, col):
                continue
            attr = getattr(modelo, col)

            if op == "=":
                cond = attr == val
            elif op == "!=":
                cond = attr != val
            elif op == ">":
                cond = attr > val
            elif op == "<":
                cond = attr < val
            elif op == ">=":
                cond = attr >= val
            elif op == "<=":
                cond = attr <= val
            elif op == "like":
                cond = attr.like(f"%{val}%")
            elif op == "ilike":
                cond = attr.ilike(f"%{val}%")
            elif op == "in":
                if not isinstance(val, (list, tuple)):
                    raise ValueError(f"'in' requer lista ou tupla, recebeu {type(val)}")
                cond = attr.in_(val)
            else:
                raise ValueError(f"Operador desconhecido: {op}")

            (ors if use_or else ands).append(cond)

        if ors:
            return or_(*ors)
        if ands:
            return and_(*ands)
        return None

    # 5. Aplica filtros
    filtro_final = processar(filtros)
    if filtro_final is not None:
        stmt = stmt.where(filtro_final)

    # 6. Aplica ordenação
    if ordenacao:
        for item in ordenacao:
            parts = item.split()
            col, direc = parts[0], parts[1] if len(parts) > 1 else "asc"
            if hasattr(modelo, col):
                attr = getattr(modelo, col)
                stmt = stmt.order_by(attr.desc() if direc.lower() == "desc" else attr.asc())

    # 7. Limita resultados
    stmt = stmt.limit(limite)

    # 8. Executa e retorna
    resultado = await sessao.execute(stmt)
    return resultado.scalars().all()
