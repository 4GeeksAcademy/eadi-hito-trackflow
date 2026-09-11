from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Annotated

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator

VALID_CATEGORIES = (
    "carrier_last_mile",
    "carrier_international",
    "warehouse_supplies",
    "packaging_materials",
    "reverse_logistics",
    "fleet_maintenance",
    "it_and_wms_software",
    "cleaning_and_facilities",
)


class Country(str, Enum):
    USA = "USA"
    SPAIN = "Spain"


class SupplierStatus(str, Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"


class SupplierBase(BaseModel):
    name: Annotated[str, Field(min_length=1)]
    country: Country
    categories: list[str] = Field(min_length=1)
    rate_per_shipment: float = Field(gt=0)
    currency: str
    status: SupplierStatus
    service_zone: str | None = None
    contact_email: EmailStr | None = None
    notes: str | None = None

    @field_validator("service_zone", "contact_email", "notes", mode="before")
    @classmethod
    def empty_optional_values_to_none(cls, value: object) -> object:
        return None if value == "" else value

    @field_validator("categories")
    @classmethod
    def validate_categories(cls, categories: list[str]) -> list[str]:
        invalid = sorted(set(categories) - set(VALID_CATEGORIES))
        if invalid:
            raise ValueError(f"Categorías no válidas: {', '.join(invalid)}")
        return categories

    @model_validator(mode="after")
    def validate_currency(self) -> "SupplierBase":
        expected = "USD" if self.country is Country.USA else "EUR"
        if self.currency != expected:
            raise ValueError(f"La moneda para {self.country.value} debe ser {expected}")
        return self

class UserRole(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"

class User(BaseModel):
    id: int
    email: EmailStr
    hashed_password: str
    is_active: bool = True
    role: UserRole = UserRole.USER
    created_at: datetime

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    role: UserRole
    created_at: datetime

class Profile(BaseModel):
    id: int
    user_id: int
    name: str | None = None
    phone: str | None = None
    address: str | None = None

class ProfileInput(BaseModel):
    name: str | None = None
    phone: str | None = None
    address: str | None = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str | None = None
    phone: str | None = None
    address: str | None = None

class UserUpdate(BaseModel):
    email: EmailStr | None = None
    role: UserRole | None = None
    is_active: bool | None = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AuthenticatedUser(BaseModel):
    user: UserResponse
    profile: Profile


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdateRate(BaseModel):
    rate_per_shipment: float = Field(gt=0)


class SupplierUpdateStatus(BaseModel):
    status: SupplierStatus


class Supplier(SupplierBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    updated_at: datetime
