#from fastapi import FastAPI
import uvicorn


def run():
    uvicorn.run(app="fastAPI:app", host="0.0.0.0",
    port=8000, reload=True, log_level="debug")