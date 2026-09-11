"""FastAPI endpoints for TrackFlow incident analysis."""

from __future__ import annotations

import csv
import io
from typing import Any

try:
    from fastapi import FastAPI, File, HTTPException, UploadFile
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import StreamingResponse
except ImportError as error:  # pragma: no cover - gives a useful local setup error
    raise RuntimeError("Instala services/api/requirements.txt para iniciar la API.") from error

from .analyzer import IncidentSummary, analyze_csv_bytes
from .routes.suppliers import router as suppliers_router

app = FastAPI(title="TrackFlow Incident Analysis API", version="1.0.0")
app.include_router(suppliers_router)
app.include_router(suppliers_router, prefix="/api")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://127.0.0.1:3001"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
_last_summary: IncidentSummary | None = None


def _as_json(summary: IncidentSummary) -> dict[str, Any]:
    return summary.as_dict()


@app.post("/api/incidents/analyze")
async def analyze_incidents(file: UploadFile = File(...)) -> dict[str, Any]:
    """Validate and analyze an uploaded incidents CSV."""

    global _last_summary
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(status_code=415, detail="El fichero debe tener extensión .csv.")
    content = await file.read()
    try:
        _last_summary = analyze_csv_bytes(content)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    return _as_json(_last_summary)


@app.get("/api/incidents/results/export")
async def export_results() -> StreamingResponse:
    """Download the most recent analysis as a two-column CSV."""

    if _last_summary is None:
        raise HTTPException(status_code=404, detail="Todavía no existe ningún análisis.")
    output = io.StringIO(newline="")
    writer = csv.writer(output)
    writer.writerow(("metric", "value"))
    for key, value in _as_json(_last_summary).items():
        if isinstance(value, dict):
            for nested_key, nested_value in value.items():
                writer.writerow((f"{key}.{nested_key}", nested_value))
        elif key != "invalid_records_detail":
            writer.writerow((key, value if value is not None else ""))
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=results.csv"},
    )
