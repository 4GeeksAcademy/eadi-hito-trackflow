from fastapi.testclient import TestClient

from auth_dependencies import create_access_token
from auth_service import create_user
from database import get_db
from main import app
from models import UserCreate

client = TestClient(app)


def setup_function() -> None:
    with get_db() as db:
        db.table("suppliers").truncate()


def test_supplier_list_cache_is_invalidated_after_create_and_update() -> None:
    user = create_user(UserCreate(email="supplier-cache@example.com", password="SafePassword123"))
    headers = {"Authorization": f"Bearer {create_access_token(user)}"}
    assert client.get("/suppliers", headers=headers).json() == []

    created = client.post(
        "/suppliers",
        json={
            "name": "Transportes Demo",
            "country": "Spain",
            "categories": ["carrier_last_mile"],
            "rate_per_shipment": 2.5,
            "currency": "EUR",
            "status": "active",
            "contact_email": "contacto@example.com",
        },
    )
    assert created.status_code == 201
    supplier_id = created.json()["id"]
    assert len(client.get("/api/suppliers", headers=headers).json()) == 1

    updated = client.patch(
        f"/suppliers/{supplier_id}/status",
        json={"status": "suspended"},
        headers=headers,
    )
    assert updated.status_code == 200
    suppliers = client.get("/suppliers", headers=headers).json()
    assert suppliers[0]["status"] == "suspended"
    assert suppliers[0]["contact_email"] == "contacto@example.com"

    rate_updated = client.patch(
        f"/suppliers/{supplier_id}/rate",
        json={"rate_per_shipment": 3.75},
        headers=headers,
    )
    assert rate_updated.status_code == 200
    assert client.get("/suppliers", headers=headers).json()[0]["rate_per_shipment"] == 3.75

    deleted = client.delete(f"/suppliers/{supplier_id}", headers=headers)
    assert deleted.status_code == 204
    assert client.get("/suppliers", headers=headers).json() == []