from __future__ import annotations

from datetime import datetime, timezone

from sqlmodel import Field, SQLModel
from sqlalchemy import Column, ForeignKey, Integer


class SKU(SQLModel, table=True):
    __tablename__ = "inventory_skus"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    sku: str = Field(index=True, unique=True)
    client_name: str = Field(index=True)
    category: str = Field(index=True)
    warehouse: str = Field(index=True)



class StockEntry(SQLModel, table=True):
    __tablename__ = "inventory_stock_entries"

    id: int | None = Field(default=None, primary_key=True)
    sku_id: int = Field(sa_column=Column(Integer, ForeignKey("inventory_skus.id"), nullable=False, index=True))
    quantity: int = Field(gt=0)
    reference: str = Field(index=True, unique=True)
    warehouse: str = Field(index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_uuid: str = Field(index=True)



class StockExit(SQLModel, table=True):
    __tablename__ = "inventory_stock_exits"

    id: int | None = Field(default=None, primary_key=True)
    sku_id: int = Field(sa_column=Column(Integer, ForeignKey("inventory_skus.id"), nullable=False, index=True))
    quantity: int = Field(gt=0)
    exit_type: str = Field(index=True)
    tracking_number: str | None = None
    warehouse: str = Field(index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_uuid: str = Field(index=True)

