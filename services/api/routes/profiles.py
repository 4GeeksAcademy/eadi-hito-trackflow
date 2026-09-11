from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from ..auth_dependencies import get_current_user
from ..auth_service import get_profile_by_user_id, update_profile
from ..models import Profile, ProfileInput, User

router = APIRouter(prefix="/profiles", tags=["profiles"])


def _profile_or_error(user_id: int) -> Profile:
    profile = get_profile_by_user_id(user_id)
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado.")
    return profile


@router.get("/me", response_model=Profile)
def get_my_profile(current_user: User = Depends(get_current_user)) -> Profile:
    return _profile_or_error(current_user.id)


@router.put("/me", response_model=Profile)
def update_my_profile(payload: ProfileInput, current_user: User = Depends(get_current_user)) -> Profile:
    profile = update_profile(current_user.id, payload.model_dump())
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Perfil no encontrado.")
    return profile
