from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, model_validator

Warehouse = Literal["LA", "ZGZ"]
Category = Literal["fashion", "electronics", "cosmetics"]
ExitType = Literal["dispatch", "loss"]


class SKUCreate(BaseModel):
    name: str = Field(min_length=1)
    sku: str = Field(min_length=1)
    client_name: str = Field(min_length=1)
    category: Category
    warehouse: Warehouse


class SKUResponse(SKUCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    current_stock: int


class StockEntryCreate(BaseModel):
    sku_id: int = Field(gt=0)
    quantity: int = Field(gt=0)
    reference: str = Field(min_length=1)
    warehouse: Warehouse


class StockEntryResponse(StockEntryCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    user_uuid: str


class StockExitCreate(BaseModel):
    sku_id: int = Field(gt=0)
    quantity: int = Field(gt=0)
    exit_type: ExitType
    tracking_number: str | None = None
    warehouse: Warehouse

    @model_validator(mode="after")
    def validate_tracking_number(self) -> "StockExitCreate":
        if self.exit_type == "dispatch" and not self.tracking_number:
            raise ValueError("tracking_number es obligatorio cuando exit_type es 'dispatch'.")
        if self.exit_type == "loss" and self.tracking_number is not None:
            raise ValueError("tracking_number debe ser nulo cuando exit_type es 'loss'.")
        return self


class StockExitResponse(StockExitCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    user_uuid: str


class InventoryOrderResponse(BaseModel):
    type: Literal["inbound", "outbound"]
    id: int
    sku_id: int
    sku: str
    name: str
    client_name: str
    quantity: int
    warehouse: Warehouse
    created_at: datetime
    user_uuid: str
    reference: str | None = None
    exit_type: ExitType | None = None
    tracking_number: str | None = None
