from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..auth_dependencies import create_access_token, get_current_user
from ..auth_service import get_profile_by_user_id, get_user_by_email, user_response, verify_password
from ..models import AuthenticatedUser, LoginRequest, TokenResponse, User

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    user = get_user_by_email(str(payload.email))
    if user is None or not verify_password(payload.password, user):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email o contraseña incorrectos.")
    return TokenResponse(access_token=create_access_token(user))


@router.get("/me", response_model=AuthenticatedUser)
def auth_me(user: User = Depends(get_current_user)) -> AuthenticatedUser:
    profile = get_profile_by_user_id(user.id)
    if profile is None:
        raise HTTPException(status_code=500, detail="El perfil del usuario no existe.")
    return AuthenticatedUser(user=user_response(user), profile=profile)
