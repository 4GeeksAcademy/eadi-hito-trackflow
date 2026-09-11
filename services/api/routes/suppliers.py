from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException, Query, status
from ..database import get_db
from ..models import (
    Country,
    Supplier,
    SupplierCreate,
    SupplierUpdateRate,
    SupplierUpdateStatus,
)

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


def _to_supplier(record: dict[str, Any]) -> Supplier:
    return Supplier.model_validate({**record, "id": record.doc_id})


def _find_supplier(db: Any, supplier_id: int) -> dict[str, Any] | None:
    return db.get(doc_id=supplier_id)


@router.post("", response_model=Supplier, status_code=status.HTTP_201_CREATED)
def create_supplier(payload: SupplierCreate) -> Supplier:
    with get_db() as db:
        supplier_id = db.insert({**payload.model_dump(mode="json"), "updated_at": datetime.now(timezone.utc).isoformat()})
        return _to_supplier(db.get(doc_id=supplier_id))


@router.get("", response_model=list[Supplier])
def list_suppliers(
    country: Country | None = Query(default=None),
    category: str | None = Query(default=None),
) -> list[Supplier]:
    with get_db() as db:
        records = db.all()
    if country is not None:
        records = [record for record in records if record["country"] == country.value]
    if category is not None:
        records = [record for record in records if category in record["categories"]]
    return [_to_supplier(record) for record in records]


@router.get("/{supplier_id}", response_model=Supplier)
def get_supplier(supplier_id: int) -> Supplier:
    with get_db() as db:
        record = _find_supplier(db, supplier_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado.")
    return _to_supplier(record)


@router.patch("/{supplier_id}/rate", response_model=Supplier)
def update_supplier_rate(supplier_id: int, payload: SupplierUpdateRate) -> Supplier:
    with get_db() as db:
        record = _find_supplier(db, supplier_id)
        if record is None:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado.")
        db.update({"rate_per_shipment": payload.rate_per_shipment, "updated_at": datetime.now(timezone.utc).isoformat()}, doc_ids=[supplier_id])
        return _to_supplier(db.get(doc_id=supplier_id))


@router.patch("/{supplier_id}/status", response_model=Supplier)
def update_supplier_status(supplier_id: int, payload: SupplierUpdateStatus) -> Supplier:
    with get_db() as db:
        record = _find_supplier(db, supplier_id)
        if record is None:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado.")
        db.update({"status": payload.status.value}, doc_ids=[supplier_id])
        return _to_supplier(db.get(doc_id=supplier_id))


@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(supplier_id: int) -> None:
    with get_db() as db:
        if _find_supplier(db, supplier_id) is None:
            raise HTTPException(status_code=404, detail="Proveedor no encontrado.")
        db.remove(doc_ids=[supplier_id])
