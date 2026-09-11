from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..auth_dependencies import get_current_user
from ..auth_service import create_user, delete_user, get_user_by_id, user_response, update_user
from ..models import User, UserCreate, UserResponse, UserRole, UserUpdate

router = APIRouter(prefix="/users", tags=["users"])


def _is_admin(user: User) -> bool:
    return user.role is UserRole.ADMIN


def _ensure_self_or_admin(target_id: int, current_user: User) -> None:
    if current_user.id != target_id and not _is_admin(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No puedes acceder a otro usuario.")


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate) -> UserResponse:
    try:
        user = create_user(payload)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    return UserResponse(**user_response(user))


@router.get("", response_model=list[UserResponse])
def list_users(current_user: User = Depends(get_current_user)) -> list[UserResponse]:
    from ..database import get_db
    from ..auth_service import _user_from_record
    with get_db() as db:
        users = [_user_from_record(record) for record in db.table("users").all()]
    return [UserResponse(**user_response(user)) for user in users]


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, current_user: User = Depends(get_current_user)) -> UserResponse:
    _ensure_self_or_admin(user_id, current_user)
    user = get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    return UserResponse(**user_response(user))


@router.put("/{user_id}", response_model=UserResponse)
def update_user_endpoint(user_id: int, payload: UserUpdate, current_user: User = Depends(get_current_user)) -> UserResponse:
    _ensure_self_or_admin(user_id, current_user)
    if payload.role is not None and not _is_admin(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo un admin puede cambiar roles.")
    if payload.is_active is not None and not _is_admin(current_user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Solo un admin puede cambiar el estado.")
    try:
        user = update_user(user_id, payload)
    except ValueError as error:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(error)) from error
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    return UserResponse(**user_response(user))


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_endpoint(user_id: int, current_user: User = Depends(get_current_user)) -> None:
    _ensure_self_or_admin(user_id, current_user)
    if not delete_user(user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
