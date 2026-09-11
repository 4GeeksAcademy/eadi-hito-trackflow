"""FastAPI endpoints for TrackFlow incident analysis."""

from __future__ import annotations

try:
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
except ImportError as error:  # pragma: no cover - gives a useful local setup error
    raise RuntimeError("Instala services/api/requirements.txt para iniciar la API.") from error

from .routes.auth import router as auth_router
from .routes.profiles import router as profiles_router
from .routes.suppliers import router as suppliers_router
from .routes.users import router as users_router

app = FastAPI(title="TrackFlow Operational API", version="1.0.0")
app.include_router(auth_router)
app.include_router(profiles_router)
app.include_router(users_router)
app.include_router(suppliers_router)
app.include_router(suppliers_router, prefix="/api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
