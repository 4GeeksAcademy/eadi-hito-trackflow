from __future__ import annotations

import os
from pathlib import Path
from collections.abc import Generator

from tinydb import TinyDB

DEFAULT_DB_PATH = Path(__file__).resolve().parent / "data" / "suppliers.json"
DB_PATH = Path(os.getenv("TRACKFLOW_DB_PATH", str(DEFAULT_DB_PATH)))


def get_db() -> TinyDB:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    return TinyDB(DB_PATH, ensure_ascii=False, indent=2)


def get_table(name: str):
    return get_db().table(name)

from dotenv import load_dotenv
from sqlmodel import Session, create_engine
from sqlalchemy.pool import StaticPool

load_dotenv(Path(__file__).resolve().parent / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite://")

_sqlite_options = (
    {"connect_args": {"check_same_thread": False}, "poolclass": StaticPool}
    if DATABASE_URL.startswith("sqlite")
    else {}
)

engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    **_sqlite_options,
)


def get_sqlmodel_session() -> Generator[Session, None, None]:
    """Yield one SQLModel session per request; TinyDB remains available via get_db."""
    with Session(engine) as session:
        yield session


def initialize_inventory_schema() -> None:
    # Import registers inventory tables in SQLModel.metadata before create_all.
    import inventory_models  # noqa: F401
    from sqlmodel import SQLModel

    SQLModel.metadata.create_all(engine)
