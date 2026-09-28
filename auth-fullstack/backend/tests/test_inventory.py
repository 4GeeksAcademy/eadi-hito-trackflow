from __future__ import annotations

from fastapi.testclient import TestClient
from sqlalchemy import delete
from sqlmodel import Session

from auth_dependencies import create_access_token
from auth_service import create_user, get_user_by_id
from database import engine, get_db, initialize_inventory_schema
from inventory_models import SKU, StockEntry, StockExit
from main import app
from models import UserCreate

client = TestClient(app)


def setup_function() -> None:
    initialize_inventory_schema()
    with Session(engine) as session:
        session.exec(delete(StockExit))
        session.exec(delete(StockEntry))
        session.exec(delete(SKU))
        session.commit()


def authorized_headers() -> dict[str, str]:
    user = create_user(UserCreate(email="warehouse@example.com", password="SafePassword123"))
    return {"Authorization": f"Bearer {create_access_token(user)}"}


def sku_payload(**overrides: object) -> dict[str, object]:
    payload: dict[str, object] = {
        "name": "Zapatilla blanca clásica - Talla 42",
        "sku": "CLT-SNK-W-42",
        "client_name": "PureStep Footwear",
        "category": "fashion",
        "warehouse": "LA",
    }
    payload.update(overrides)
    return payload


def create_test_sku(headers: dict[str, str], **overrides: object) -> dict[str, object]:
    response = client.post("/inventory/products", json=sku_payload(**overrides), headers=headers)
    assert response.status_code == 201, response.text
    return response.json()


def test_inventory_writes_require_authentication() -> None:
    assert client.post("/inventory/products", json=sku_payload()).status_code == 401
    assert client.post(
        "/inventory/orders/inbound",
        json={"sku_id": 1, "quantity": 1, "reference": "PO-TEST", "warehouse": "LA"},
    ).status_code == 401


def test_stock_is_calculated_separately_per_warehouse() -> None:
    headers = authorized_headers()
    la = create_test_sku(headers, sku="CLT-SNK-LA", warehouse="LA")
    zgz = create_test_sku(headers, sku="CLT-SNK-ZGZ", warehouse="ZGZ")
    for sku_record, warehouse, reference in (
        (la, "LA", "PO-LA-1"), (zgz, "ZGZ", "PO-ZGZ-1")
    ):
        response = client.post(
            "/inventory/orders/inbound",
            json={"sku_id": sku_record["id"], "quantity": 12, "reference": reference, "warehouse": warehouse},
            headers=headers,
        )
        assert response.status_code == 201, response.text
    exit_response = client.post(
        "/inventory/orders/outbound",
        json={"sku_id": la["id"], "quantity": 5, "exit_type": "dispatch", "tracking_number": "1ZTEST001", "warehouse": "LA"},
        headers=headers,
    )
    assert exit_response.status_code == 201, exit_response.text
    products = {item["sku"]: item for item in client.get("/inventory/products").json()}
    assert products["CLT-SNK-LA"]["current_stock"] == 7
    assert products["CLT-SNK-ZGZ"]["current_stock"] == 12
    assert exit_response.json()["user_uuid"]


def test_insufficient_stock_is_rejected_without_persisting_exit() -> None:
    headers = authorized_headers()
    sku_record = create_test_sku(headers)
    client.post(
        "/inventory/orders/inbound",
        json={"sku_id": sku_record["id"], "quantity": 4, "reference": "PO-LA-STOCK", "warehouse": "LA"},
        headers=headers,
    )
    response = client.post(
        "/inventory/orders/outbound",
        json={"sku_id": sku_record["id"], "quantity": 5, "exit_type": "loss", "warehouse": "LA"},
        headers=headers,
    )
    assert response.status_code == 400
    assert response.json()["detail"] == "Insufficient stock for SKU 'CLT-SNK-W-42'. Available: 4, requested: 5."
    orders = client.get("/inventory/orders").json()
    assert not any(order["type"] == "outbound" for order in orders)


def test_tracking_number_rules_are_enforced() -> None:
    headers = authorized_headers()
    sku_record = create_test_sku(headers)
    no_tracking = client.post(
        "/inventory/orders/outbound",
        json={"sku_id": sku_record["id"], "quantity": 1, "exit_type": "dispatch", "warehouse": "LA"},
        headers=headers,
    )
    assert no_tracking.status_code == 400
    tracking_for_loss = client.post(
        "/inventory/orders/outbound",
        json={"sku_id": sku_record["id"], "quantity": 1, "exit_type": "loss", "tracking_number": "NOT-ALLOWED", "warehouse": "LA"},
        headers=headers,
    )
    assert tracking_for_loss.status_code == 400


def test_old_tinydb_users_receive_a_stable_uuid(isolated_database) -> None:
    with get_db() as db:
        legacy_id = db.table("users").insert({
            "email": "legacy@example.com",
            "hashed_password": "unused-test-hash",
            "is_active": True,
            "role": "user",
            "created_at": "2025-01-01T00:00:00+00:00",
        })
    migrated = get_user_by_id(legacy_id)
    assert migrated is not None
    assert migrated.user_uuid
    assert get_user_by_id(legacy_id).user_uuid == migrated.user_uuid
    with get_db() as db:
        assert db.table("users").get(doc_id=legacy_id)["user_uuid"] == migrated.user_uuid


def test_development_seed_net_stock_matches_movements() -> None:
    from inventory_seed import seed_inventory

    seed_inventory()
    stocks = {item["sku"]: item["current_stock"] for item in client.get("/inventory/products").json()}
    assert stocks == {
        "CLT-SNK-W-42": 100,
        "CLT-SNK-W-42-Z": 60,
        "TEC-EAR-001": 34,
        "CSM-SRM-030": 39,
        "CLT-CHN-N-32": 16,
        "TEC-CHG-065": 48,
    }
