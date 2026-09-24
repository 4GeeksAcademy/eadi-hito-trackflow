from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, status

from incident_service import create_incident, get_incident, incident_summary, list_incidents, update_incident_status
from models import Incident, IncidentBranch, IncidentCategory, IncidentCreate, IncidentOrigin, IncidentStatus, IncidentUpdateStatus

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.post("", response_model=Incident, status_code=status.HTTP_201_CREATED)
def create(payload: IncidentCreate) -> Incident:
    return create_incident(payload)


@router.get("", response_model=list[Incident])
def list_all(
    status_filter: IncidentStatus | None = Query(None, alias="status"),
    origin: IncidentOrigin | None = None,
    branch: IncidentBranch | None = None,
    category: IncidentCategory | None = None,
) -> list[Incident]:
    return list_incidents({"status": status_filter.value if status_filter else None, "origin": origin.value if origin else None, "branch": branch.value if branch else None, "category": category.value if category else None})


@router.get("/summary")
def summary() -> dict[str, dict[str, int]]:
    return incident_summary()


@router.get("/{incident_id}", response_model=Incident)
def detail(incident_id: int) -> Incident:
    incident = get_incident(incident_id)
    if incident is None:
        raise HTTPException(status_code=404, detail="Incidencia no encontrada.")
    return incident


@router.patch("/{incident_id}/status", response_model=Incident)
def update_status(incident_id: int, payload: IncidentUpdateStatus) -> Incident:
    try:
        incident = update_incident_status(incident_id, payload)
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    if incident is None:
        raise HTTPException(status_code=404, detail="Incidencia no encontrada.")
    return incident
