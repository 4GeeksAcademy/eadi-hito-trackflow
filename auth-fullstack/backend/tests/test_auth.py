from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from fastapi import HTTPException
from jose import jwt

from auth_dependencies import create_access_token, get_current_user
from auth_service import create_user, delete_user, get_profile_by_user_id, get_user_by_email, update_password, update_user, update_profile, verify_password
from models import ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, ResetPasswordRequest, UserCreate, UserUpdate
from password_reset_service import consume_reset_token, issue_reset_token, validate_reset_token
from routes.auth import auth_me, change_password, forgot_password, login, reset_password


@pytest.fixture
def user():
    return create_user(UserCreate(email="person@example.com", password="Correcta123", name="Persona"))


def test_register_creates_user_and_profile(user):
    assert user.email == "person@example.com"
    assert user.id is not None
    assert get_user_by_email(" PERSON@EXAMPLE.COM ").id == user.id
    assert verify_password("Correcta123", user)


def test_register_rejects_duplicate_email(user):
    with pytest.raises(ValueError, match="Ya existe"):
        create_user(UserCreate(email="person@example.com", password="OtraClave123"))


def test_register_rejects_password_shorter_than_eight_characters():
    with pytest.raises(ValueError):
        UserCreate(email="short@example.com", password="1234567")


def test_login_returns_access_token_for_valid_credentials(user):
    response = login(LoginRequest(email="person@example.com", password="Correcta123"))
    assert response.token_type == "bearer"
    assert response.access_token
    assert get_current_user(response.access_token).id == user.id


def test_login_rejects_invalid_password(user):
    with pytest.raises(HTTPException) as error:
        login(LoginRequest(email="person@example.com", password="incorrecta"))
    assert error.value.status_code == 401


def test_login_rejects_unknown_email():
    with pytest.raises(HTTPException) as error:
        login(LoginRequest(email="missing@example.com", password="Correcta123"))
    assert error.value.status_code == 401


def test_auth_me_returns_user_without_password_and_profile(user):
    response = auth_me(user)
    assert response.user.email == "person@example.com"
    assert not hasattr(response.user, "hashed_password")
    assert response.profile.user_id == user.id


def test_get_current_user_rejects_expired_token(user):
    token = jwt.encode(
        {"sub": str(user.id), "exp": datetime.now(timezone.utc) - timedelta(minutes=1)},
        "test-secret-key",
        algorithm="HS256",
    )
    with pytest.raises(HTTPException) as error:
        get_current_user(token)
    assert error.value.status_code == 401


def test_forgot_password_is_generic_for_unknown_email(monkeypatch):
    sent = []
    monkeypatch.setattr("routes.auth.send_reset_for_email", lambda email: sent.append(email))
    response = forgot_password(ForgotPasswordRequest(email="unknown@example.com"))
    assert "recibirás" in response["message"]
    assert sent == ["unknown@example.com"]


def test_forgot_password_sends_reset_for_existing_email(user, monkeypatch):
    sent = []
    monkeypatch.setattr("routes.auth.send_reset_for_email", lambda email: sent.append(email))
    forgot_password(ForgotPasswordRequest(email="person@example.com"))
    assert sent == ["person@example.com"]


def test_reset_password_updates_password_and_consumes_token(user, monkeypatch):
    token = issue_reset_token(user.id)
    response = reset_password(ResetPasswordRequest(token=token, new_password="NuevaClave123"))
    assert response["message"] == "Contraseña restablecida correctamente."
    updated = get_user_by_email("person@example.com")
    assert verify_password("NuevaClave123", updated)
    monkeypatch.setattr("routes.auth.update_password", lambda *_args: updated)
    with pytest.raises(HTTPException) as error:
        reset_password(ResetPasswordRequest(token=token, new_password="OtraClave123"))
    assert error.value.status_code == 400


def test_reset_password_rejects_malformed_token():
    with pytest.raises(HTTPException) as error:
        reset_password(ResetPasswordRequest(token="not-a-token", new_password="NuevaClave123"))
    assert error.value.status_code == 400


def test_change_password_requires_current_password(user):
    with pytest.raises(HTTPException) as error:
        change_password(
            ChangePasswordRequest(current_password="incorrecta", new_password="NuevaClave123"),
            user,
        )
    assert error.value.status_code == 400


def test_change_password_updates_password(user):
    response = change_password(
        ChangePasswordRequest(current_password="Correcta123", new_password="NuevaClave123"),
        user,
    )
    assert response["message"] == "Contraseña actualizada correctamente."
    assert verify_password("NuevaClave123", get_user_by_email("person@example.com"))


def test_reset_token_cannot_be_consumed_twice(user):
    token = issue_reset_token(user.id)
    _, token_id = validate_reset_token(token)
    consume_reset_token(token_id)
    with pytest.raises(ValueError, match="utilizado"):
        validate_reset_token(token)


def test_update_password_returns_none_for_unknown_user():
    assert update_password(999, "NuevaClave123") is None


def test_profile_and_user_updates_cover_business_rules(user):
    assert get_profile_by_user_id(user.id).name == "Persona"
    profile = update_profile(user.id, {"name": "Nuevo nombre"})
    assert profile.name == "Nuevo nombre"
    updated = update_user(user.id, UserUpdate(email="person+updated@example.com"))
    assert str(updated.email) == "person+updated@example.com"


def test_delete_user_removes_user_and_profile(user):
    assert delete_user(user.id) is True
    assert get_user_by_email("person@example.com") is None
    assert get_profile_by_user_id(user.id) is None
    assert delete_user(user.id) is False
