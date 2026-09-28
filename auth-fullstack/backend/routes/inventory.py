from __future__ import annotations

from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select

from auth_dependencies import get_current_user
from database import get_sqlmodel_session
from inventory_models import SKU, StockEntry, StockExit
from schemas import (
    InventoryOrderResponse,
    SKUCreate,
    SKUResponse,
    StockEntryCreate,
    StockEntryResponse,
    StockExitCreate,
    StockExitResponse,
)
from models import User

router = APIRouter(prefix="/inventory", tags=["inventory"])


def _stock_for(session: Session, sku_id: int, warehouse: str) -> int:
    inbound = session.exec(
        select(func.coalesce(func.sum(StockEntry.quantity), 0)).where(
            StockEntry.sku_id == sku_id, StockEntry.warehouse == warehouse
        )
    ).one()
    outbound = session.exec(
        select(func.coalesce(func.sum(StockExit.quantity), 0)).where(
            StockExit.sku_id == sku_id, StockExit.warehouse == warehouse
        )
    ).one()
    return int(inbound - outbound)


def _sku_response(session: Session, sku: SKU) -> SKUResponse:
    return SKUResponse.model_validate(
        {**sku.model_dump(), "current_stock": _stock_for(session, sku.id, sku.warehouse)}
    )


def _validate_sku_warehouse(sku: SKU | None, warehouse: str) -> SKU:
    if sku is None:
        raise HTTPException(status_code=404, detail="SKU no encontrado.")
    if sku.warehouse != warehouse:
        raise HTTPException(
            status_code=400,
            detail=f"El SKU '{sku.sku}' pertenece al almacén {sku.warehouse}, no a {warehouse}.",
        )
    return sku


@router.get("/products", response_model=list[SKUResponse])
def list_products(session: Session = Depends(get_sqlmodel_session)) -> list[SKUResponse]:
    return [_sku_response(session, sku) for sku in session.exec(select(SKU).order_by(SKU.id)).all()]


@router.post("/products", response_model=SKUResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: SKUCreate,
    session: Session = Depends(get_sqlmodel_session),
    _user: User = Depends(get_current_user),
) -> SKUResponse:
    existing = session.exec(select(SKU).where(SKU.sku == payload.sku)).first()
    if existing:
        raise HTTPException(status_code=409, detail=f"El SKU '{payload.sku}' ya existe.")
    sku = SKU.model_validate(payload.model_dump())
    session.add(sku)
    session.commit()
    session.refresh(sku)
    return _sku_response(session, sku)


@router.get("/products/{id}", response_model=SKUResponse)
def get_product(id: int, session: Session = Depends(get_sqlmodel_session)) -> SKUResponse:
    sku = session.get(SKU, id)
    if sku is None:
        raise HTTPException(status_code=404, detail="SKU no encontrado.")
    return _sku_response(session, sku)


@router.post("/orders/inbound", response_model=StockEntryResponse, status_code=status.HTTP_201_CREATED)
def create_inbound(
    payload: StockEntryCreate,
    session: Session = Depends(get_sqlmodel_session),
    user: User = Depends(get_current_user),
) -> StockEntryResponse:
    sku = _validate_sku_warehouse(session.get(SKU, payload.sku_id), payload.warehouse)
    del sku
    entry = StockEntry.model_validate({**payload.model_dump(), "user_uuid": user.user_uuid})
    session.add(entry)
    try:
        session.commit()
    except Exception:
        session.rollback()
        raise
    session.refresh(entry)
    return StockEntryResponse.model_validate(entry)


@router.post("/orders/outbound", response_model=StockExitResponse, status_code=status.HTTP_201_CREATED)
def create_outbound(
    payload: StockExitCreate,
    session: Session = Depends(get_sqlmodel_session),
    user: User = Depends(get_current_user),
) -> StockExitResponse:
    sku = _validate_sku_warehouse(session.get(SKU, payload.sku_id), payload.warehouse)
    available = _stock_for(session, payload.sku_id, payload.warehouse)
    if payload.quantity > available:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Insufficient stock for SKU '{sku.sku}'. Available: {available}, "
                f"requested: {payload.quantity}."
            ),
        )
    exit_record = StockExit.model_validate({**payload.model_dump(), "user_uuid": user.user_uuid})
    session.add(exit_record)
    session.commit()
    session.refresh(exit_record)
    return StockExitResponse.model_validate(exit_record)


@router.get("/orders", response_model=list[InventoryOrderResponse])
def list_orders(session: Session = Depends(get_sqlmodel_session)) -> list[InventoryOrderResponse]:
    orders: list[InventoryOrderResponse] = []
    for entry in session.exec(select(StockEntry)).all():
        sku = session.get(SKU, entry.sku_id)
        if sku is not None:
            orders.append(
                InventoryOrderResponse(
                    type="inbound", id=entry.id, sku_id=entry.sku_id, sku=sku.sku,
                    name=sku.name, client_name=sku.client_name, quantity=entry.quantity,
                    warehouse=entry.warehouse, created_at=entry.created_at,
                    user_uuid=entry.user_uuid, reference=entry.reference,
                )
            )
    for exit_record in session.exec(select(StockExit)).all():
        sku = session.get(SKU, exit_record.sku_id)
        if sku is not None:
            orders.append(
                InventoryOrderResponse(
                    type="outbound", id=exit_record.id, sku_id=exit_record.sku_id,
                    sku=sku.sku, name=sku.name, client_name=sku.client_name,
                    quantity=exit_record.quantity, warehouse=exit_record.warehouse,
                    created_at=exit_record.created_at, user_uuid=exit_record.user_uuid,
                    exit_type=exit_record.exit_type, tracking_number=exit_record.tracking_number,
                )
            )
    return sorted(orders, key=lambda order: (order.created_at, order.type, order.id), reverse=True)
