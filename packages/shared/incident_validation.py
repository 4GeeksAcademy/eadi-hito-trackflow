from __future__ import annotations

from datetime import datetime, timezone

STATUS_MAP = {"OPEN": "open", "CLOSED": "resolved", "DISCARDED": "discarded"}
CATEGORY_MAP = {"LOST_PARCEL": "lost_parcel", "DELAYED_DELIVERY": "carrier_issue", "WRONG_ADDRESS": "delivery_failure", "RETURN_REQUEST": "returns_issue", "DAMAGE": "carrier_issue"}
BRANCH_MAP = {"US": "la_office", "ES": "zaragoza_office"}


def transform_csv_row(row: dict[str, str]) -> dict[str, object]:
    description = row.get("description", "")
    title = description[:120].strip()
    if not title or not description.strip():
        raise ValueError("description no puede estar vacío")
    try:
        created_at = datetime.strptime(row["date"], "%Y-%m-%d").replace(tzinfo=timezone.utc)
    except (KeyError, ValueError) as error:
        raise ValueError("date debe tener formato YYYY-MM-DD") from error
    try:
        return {"source_id": row.get("incident_id") or f"{title}:{created_at.isoformat()}", "title": title, "description": description, "status": STATUS_MAP[row["status"].upper()], "category": CATEGORY_MAP[row["category"].upper()], "origin": "customer", "branch": BRANCH_MAP[row["country"].upper()], "created_at": created_at.isoformat(), "updated_at": created_at.isoformat()}
    except KeyError as error:
        raise ValueError(f"valor no reconocido: {error.args[0]}") from error
