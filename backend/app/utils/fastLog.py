# app/utils/fastLog.py

import os
import sys
import logging
from datetime import datetime
from logging.handlers import TimedRotatingFileHandler

import structlog
from structlog.stdlib import ProcessorFormatter
from structlog.processors import JSONRenderer, TimeStamper


def console_renderer(_logger, _name, event_dict):
    """
    Renderiza para terminal no estilo:
    16-05-2025 12:49:25 - [INFO] - Service - Mensagem
    """
    ts = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    lvl = event_dict.get("level", "").upper().ljust(5)
    module = event_dict.get("module", "Geral")
    message = event_dict.get("event", "")
    return f"{ts} - [{lvl}] - {module} - {message}"


def setup_logging(
    log_dir: str = "logs",
    log_name: str = "app",
    log_level: int = logging.INFO,
):
    # Cria pasta de logs
    os.makedirs(log_dir, exist_ok=True)

    # Configura o logging raiz
    root = logging.getLogger()
    root.setLevel(log_level)
    # Remove handlers padrão
    for h in list(root.handlers):
        root.removeHandler(h)

    # Pré-processadores comuns (timestamp e level) usados pelo ProcessorFormatter
    pre_chain = [
        TimeStamper(fmt="iso"),          # só para o JSON
        structlog.stdlib.add_log_level,
    ]

    # Formatter do console (bonitinho)
    console_fmt = ProcessorFormatter(
        processor=console_renderer,
        foreign_pre_chain=pre_chain,
    )
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(log_level)
    ch.setFormatter(console_fmt)
    root.addHandler(ch)

    # Formatter do arquivo (JSON sem escapes Unicode)
    json_fmt = ProcessorFormatter(
        processor=JSONRenderer(indent=None, sort_keys=False, ensure_ascii=False),
        foreign_pre_chain=pre_chain,
    )
    fh = TimedRotatingFileHandler(
        filename=os.path.join(log_dir, f"{log_name}.log"),
        when="midnight",
        backupCount=30,
        encoding="utf-8",
    )
    fh.setLevel(log_level)
    fh.setFormatter(json_fmt)
    root.addHandler(fh)
    
    # Silencia logs internos do Uvicorn (startup, shutdown, etc.)
    for name in ("uvicorn", "uvicorn.error"):
        lg = logging.getLogger(name)
        lg.handlers.clear()
        lg.propagate = False
        lg.setLevel(logging.CRITICAL)  # 🔕 desativa tudo

    # Ativa apenas logs de requisições HTTP
    access_logger = logging.getLogger("uvicorn.access")
    access_logger.handlers.clear()
    access_logger.propagate = False
    access_logger.setLevel(logging.INFO)  # mantém 200, 404, etc.
    access_logger.addHandler(ch)
    access_logger.addHandler(fh)


    # ——— Silencia totalmente o SQLAlchemy ———
    for name in ("sqlalchemy", "sqlalchemy.engine", "sqlalchemy.pool"):
        lg = logging.getLogger(name)
        lg.handlers.clear()
        lg.propagate = False
        lg.setLevel(logging.WARNING)

    # Configura o structlog
    structlog.configure(
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
        processors=[
            structlog.stdlib.filter_by_level,
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            TimeStamper(fmt="%Y-%m-%d %H:%M:%S", utc=False),  # ← UTC desativado!
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
    )


# Executa a configuração ao importar
setup_logging()

# Logger global — importe de qualquer módulo:
log = structlog.get_logger()
