"""FastAPI endpoints for TrackFlow incident analysis."""

from __future__ import annotations

try:
    from fastapi import FastAPI, Request
    from fastapi.exceptions import RequestValidationError
    from fastapi.responses import JSONResponse
    from fastapi.middleware.cors import CORSMiddleware
except ImportError as error:  # pragma: no cover - gives a useful local setup error
    raise RuntimeError("Instala backend/requirements.txt para iniciar la API.") from error

from routes.auth import router as auth_router
from routes.profiles import router as profiles_router
from routes.suppliers import router as suppliers_router
from routes.users import router as users_router
from routes.incidents import router as incidents_router

app = FastAPI(title="TrackFlow Operational API", version="1.0.0")


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=400, content={"detail": exc.errors()})


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"detail": "Error interno del servidor."})
app.include_router(auth_router)
app.include_router(profiles_router)
app.include_router(users_router)
app.include_router(incidents_router)
app.include_router(suppliers_router)
app.include_router(suppliers_router, prefix="/api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
