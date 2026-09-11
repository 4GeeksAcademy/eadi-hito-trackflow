from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

from .auth_service import get_user_by_id
from .models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def _jwt_settings() -> tuple[str, int]:
    secret = os.getenv("JWT_SECRET_KEY")
    if not secret:
        raise RuntimeError("JWT_SECRET_KEY no está configurada.")
    try:
        minutes_value = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES")
        if not minutes_value:
            raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES no está configurada.")
        minutes = int(minutes_value)
    except ValueError as error:
        raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES debe ser un entero.") from error
    return secret, minutes


def create_access_token(user: User) -> str:
    secret, minutes = _jwt_settings()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=minutes)
    payload = {"sub": str(user.id), "email": str(user.email), "role": user.role.value, "exp": expires_at}
    return jwt.encode(payload, secret, algorithm="HS256")


def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token inválido o expirado.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        secret, _ = _jwt_settings()
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        subject = payload.get("sub")
        if not subject:
            raise credentials_error
        user_id = int(subject)
    except (JWTError, ValueError, RuntimeError) as error:
        if isinstance(error, RuntimeError):
            raise HTTPException(status_code=500, detail=str(error)) from error
        raise credentials_error from error
    user = get_user_by_id(user_id)
    if user is None or not user.is_active:
        raise credentials_error
    return user


def require_admin(user: User = Depends(get_current_user)) -> User:
    if user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Se requiere rol admin.")
    return user
