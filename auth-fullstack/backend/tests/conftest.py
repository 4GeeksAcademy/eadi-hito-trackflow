from __future__ import annotations

import pytest

import database


@pytest.fixture(autouse=True)
def isolated_database(tmp_path, monkeypatch):
    """Cada test usa una TinyDB temporal para no modificar datos de desarrollo."""
    monkeypatch.setattr(database, "DB_PATH", tmp_path / "test-db.json")
    monkeypatch.setenv("JWT_SECRET_KEY", "test-secret-key")
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    monkeypatch.setenv("PASSWORD_RESET_EXPIRE_MINUTES", "30")

    yield

    database.get_db().close()
