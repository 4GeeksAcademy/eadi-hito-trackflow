from __future__ import annotations

from collections import Counter
from datetime import datetime, timezone
from typing import Any

from tinydb import Query

from database import get_db
from models import Incident, IncidentBranch, IncidentCategory, IncidentCreate, IncidentOrigin, IncidentStatus, IncidentUpdateStatus


def _from_record(record: dict[str, Any]) -> Incident:
    return Incident.model_validate({**record, "id": record.doc_id})


def create_incident(payload: IncidentCreate) -> Incident:
    now = datetime.now(timezone.utc)
    record = payload.model_dump(mode="json")
    record["created_at"] = now.isoformat()
    record["updated_at"] = now.isoformat()
    with get_db() as db:
        doc_id = db.table("incidents").insert(record)
        return _from_record(db.table("incidents").get(doc_id=doc_id))


def clear_incidents() -> None:
    with get_db() as db:
        db.table("incidents").truncate()


def list_incidents(filters: dict[str, str | None]) -> list[Incident]:
    with get_db() as db:
        records = db.table("incidents").all()
    return [
        _from_record(record)
        for record in records
        if all(value is None or record.get(key) == value for key, value in filters.items())
    ]


def get_incident(incident_id: int) -> Incident | None:
    with get_db() as db:
        record = db.table("incidents").get(doc_id=incident_id)
    return _from_record(record) if record else None


def update_incident_status(incident_id: int, payload: IncidentUpdateStatus) -> Incident | None:
    allowed = {
        IncidentStatus.OPEN: {IncidentStatus.IN_PROGRESS, IncidentStatus.DISCARDED},
        IncidentStatus.IN_PROGRESS: {IncidentStatus.RESOLVED, IncidentStatus.DISCARDED},
        IncidentStatus.RESOLVED: set(),
        IncidentStatus.DISCARDED: set(),
    }
    with get_db() as db:
        table = db.table("incidents")
        record = table.get(doc_id=incident_id)
        if record is None:
            return None
        current = IncidentStatus(record["status"])
        if payload.status not in allowed[current]:
            raise ValueError(f"Transición no permitida: {current.value} → {payload.status.value}.")
        table.update({"status": payload.status.value, "updated_at": datetime.now(timezone.utc).isoformat()}, doc_ids=[incident_id])
        return _from_record(table.get(doc_id=incident_id))


def incident_summary() -> dict[str, dict[str, int]]:
    incidents = list_incidents({"status": None, "origin": None, "branch": None, "category": None})
    statuses = [item.value for item in IncidentStatus]
    categories = [item.value for item in IncidentCategory]
    origins = [item.value for item in IncidentOrigin]
    branches = [item.value for item in IncidentBranch]
    return {
        "by_status": {key: Counter(item.status.value for item in incidents).get(key, 0) for key in statuses},
        "by_category": {key: Counter(item.category.value for item in incidents).get(key, 0) for key in categories},
        "by_origin": {key: Counter(item.origin.value for item in incidents).get(key, 0) for key in origins},
        "by_branch": {key: Counter(item.branch.value for item in incidents).get(key, 0) for key in branches},
    }
