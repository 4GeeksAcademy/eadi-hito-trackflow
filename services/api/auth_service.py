from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from passlib.hash import bcrypt
from tinydb import Query

from .database import get_db
from .models import Profile, User, UserCreate, UserRole, UserUpdate


def _user_from_record(record: dict[str, Any]) -> User:
    return User.model_validate({**record, "id": record.doc_id})


def _profile_from_record(record: dict[str, Any]) -> Profile:
    return Profile.model_validate({**record, "id": record.doc_id})


def user_response(user: User) -> dict[str, Any]:
    return user.model_dump(mode="json", exclude={"hashed_password"})


def get_user_by_id(user_id: int) -> User | None:
    with get_db() as db:
        record = db.table("users").get(doc_id=user_id)
        return _user_from_record(record) if record else None


def get_user_by_email(email: str) -> User | None:
    normalized = email.strip().lower()
    with get_db() as db:
        records = db.table("users").all()
    for record in records:
        if record["email"].lower() == normalized:
            return _user_from_record(record)
    return None


def get_profile_by_user_id(user_id: int) -> Profile | None:
    with get_db() as db:
        record = db.table("profiles").get(Query().user_id == user_id)
        return _profile_from_record(record) if record else None


def create_user(payload: UserCreate) -> User:
    if get_user_by_email(str(payload.email)):
        raise ValueError("Ya existe un usuario con ese email.")
    now = datetime.now(timezone.utc).isoformat()
    user_record = {
        "email": str(payload.email).lower(),
        "hashed_password": bcrypt.hash(payload.password),
        "is_active": True,
        "role": UserRole.USER.value,
        "created_at": now,
    }
    with get_db() as db:
        user_id = db.table("users").insert(user_record)
        db.table("profiles").insert({
            "user_id": user_id,
            "name": payload.name,
            "phone": payload.phone,
            "address": payload.address,
        })
        return _user_from_record(db.table("users").get(doc_id=user_id))


def verify_password(password: str, user: User) -> bool:
    return bcrypt.verify(password, user.hashed_password)


def update_user(user_id: int, payload: UserUpdate) -> User | None:
    user = get_user_by_id(user_id)
    if user is None:
        return None
    values = payload.model_dump(mode="json", exclude_none=True)
    if "email" in values:
        existing = get_user_by_email(values["email"])
        if existing is not None and existing.id != user_id:
            raise ValueError("Ya existe un usuario con ese email.")
        values["email"] = values["email"].lower()
    with get_db() as db:
        db.table("users").update(values, doc_ids=[user_id])
        return _user_from_record(db.table("users").get(doc_id=user_id))


def delete_user(user_id: int) -> bool:
    with get_db() as db:
        users = db.table("users")
        if users.get(doc_id=user_id) is None:
            return False
        users.remove(doc_ids=[user_id])
        db.table("profiles").remove(Query().user_id == user_id)
    return True


def update_profile(user_id: int, values: dict[str, Any]) -> Profile | None:
    with get_db() as db:
        profiles = db.table("profiles")
        profile = profiles.get(Query().user_id == user_id)
        if profile is None:
            profile_id = profiles.insert({"user_id": user_id, **values})
            return _profile_from_record(profiles.get(doc_id=profile_id))
        profiles.update(values, doc_ids=[profile.doc_id])
        return _profile_from_record(profiles.get(doc_id=profile.doc_id))
