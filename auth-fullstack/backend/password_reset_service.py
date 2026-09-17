from __future__ import annotations

import os
import secrets
from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from auth_service import get_user_by_id
from database import get_db
from email_service import send_password_reset_email

RESET_TOKEN_TYPE = "password_reset"


def _settings() -> tuple[str, int]:
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY no está configurada.")
    minutes = int(os.getenv("PASSWORD_RESET_EXPIRE_MINUTES", "30"))
    return secret, minutes


def issue_reset_token(user_id: int) -> str:
    secret, minutes = _settings()
    token_id = secrets.token_urlsafe(24)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    with get_db() as db:
        db.table("password_reset_tokens").insert({
            "token_id": token_id,
            "user_id": user_id,
            "expires_at": expires_at.isoformat(),
            "used_at": None,
        })
    return jwt.encode({"sub": str(user_id), "jti": token_id, "type": RESET_TOKEN_TYPE, "exp": expires_at}, secret, algorithm="HS256")


def send_reset_for_email(email: str) -> None:
    from auth_service import get_user_by_email
    user = get_user_by_email(email)
    if user is None:
        return
    token = issue_reset_token(user.id)
    send_password_reset_email(str(user.email), token)


def consume_reset_token(token: str) -> int:
    secret, _ = _settings()
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        if payload.get("type") != RESET_TOKEN_TYPE or not payload.get("jti"):
            raise ValueError("Tipo de token inválido.")
        user_id = int(payload["sub"])
        token_id = str(payload["jti"])
    except (JWTError, KeyError, TypeError, ValueError) as error:
        raise ValueError("Token inválido o expirado.") from error

    with get_db() as db:
        table = db.table("password_reset_tokens")
        record = table.get(lambda item: item.get("token_id") == token_id)
        if record is None or record.get("used_at") is not None or record.get("user_id") != user_id:
            raise ValueError("Token inválido o ya utilizado.")
        expires_at = datetime.fromisoformat(record["expires_at"])
        if expires_at <= datetime.now(timezone.utc):
            raise ValueError("Token inválido o expirado.")
        table.update({"used_at": datetime.now(timezone.utc).isoformat()}, doc_ids=[record.doc_id])
    if get_user_by_id(user_id) is None:
        raise ValueError("Usuario no encontrado.")
    return user_id
