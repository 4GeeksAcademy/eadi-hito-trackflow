from fastapi.testclient import TestClient

from main import app
from database import get_db

client = TestClient(app)


def setup_function() -> None:
    with get_db() as db:
        db.table("incidents").truncate()


def payload(**overrides: object) -> dict[str, object]:
    value = {"title": "Paquete perdido", "description": "No aparece en el almacén.", "category": "lost_parcel", "origin": "customer", "branch": "central"}
    value.update(overrides)
    return value


def test_create_list_detail_and_filters() -> None:
    response = client.post("/api/incidents", json=payload())
    assert response.status_code == 201
    incident_id = response.json()["id"]
    assert response.json()["status"] == "open"
    assert client.get(f"/api/incidents/{incident_id}").status_code == 200
    assert len(client.get("/api/incidents", params={"branch": "central"}).json()) == 1


def test_status_transitions_and_invalid_transition() -> None:
    incident_id = client.post("/api/incidents", json=payload()).json()["id"]
    assert client.patch(f"/api/incidents/{incident_id}/status", json={"status": "in_progress"}).status_code == 200
    assert client.patch(f"/api/incidents/{incident_id}/status", json={"status": "open"}).status_code == 400


def test_missing_detail_and_empty_summary() -> None:
    assert client.get("/api/incidents/999999").status_code == 404
    summary = client.get("/api/incidents/summary").json()
    assert summary["by_status"]["open"] == 0
    assert summary["by_branch"]["central"] == 0


def test_invalid_payload_is_rejected() -> None:
    response = client.post("/api/incidents", json=payload(title=""))
    assert response.status_code in (400, 422)
