# run.py
import uvicorn

if __name__ == "__main__":
    # roda o Uvicorn SEM o config padrão, só com seus handlers
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8194,
        log_config=None,      # desabilita o config built-in
        log_level="info",     # mantém o level
        reload=True           # se quiser hot-reload
    )
