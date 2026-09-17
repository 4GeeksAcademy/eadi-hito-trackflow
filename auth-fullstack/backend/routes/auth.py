from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, status

from auth_dependencies import create_access_token, get_current_user
from auth_service import get_profile_by_user_id, get_user_by_email, update_password, user_response, verify_password
from email_service import EmailConfigurationError
from models import AuthenticatedUser, ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, TokenResponse, User
from password_reset_service import consume_reset_token, send_reset_for_email

logger = logging.getLogger(__name__)

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


@router.post("/forgot-password", status_code=status.HTTP_200_OK)
def forgot_password(payload: ForgotPasswordRequest) -> dict[str, str]:
    try:
        send_reset_for_email(str(payload.email))
    except EmailConfigurationError:
        logger.warning("Password reset email no enviado: configuración de email incompleta.")
    except RuntimeError as error:
        logger.error("Password reset email no enviado: %s", error)
    return {"message": "Si esa dirección está registrada, recibirás un enlace en breve"}


@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(payload: ResetPasswordRequest) -> dict[str, str]:
    try:
        user_id = consume_reset_token(payload.token)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from error
    update_password(user_id, payload.new_password)
    return {"message": "Contraseña restablecida correctamente."}


@router.post("/change-password", status_code=status.HTTP_200_OK)
def change_password(payload: ChangePasswordRequest, user: User = Depends(get_current_user)) -> dict[str, str]:
    if not verify_password(payload.current_password, user):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La contraseña actual es incorrecta.")
    update_password(user.id, payload.new_password)
    return {"message": "Contraseña actualizada correctamente."}
