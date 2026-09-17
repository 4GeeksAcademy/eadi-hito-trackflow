from __future__ import annotations

import os
from pathlib import Path

from tinydb import TinyDB

DEFAULT_DB_PATH = Path(__file__).resolve().parent / "data" / "suppliers.json"
DB_PATH = Path(os.getenv("TRACKFLOW_DB_PATH", str(DEFAULT_DB_PATH)))


def get_db() -> TinyDB:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    return TinyDB(DB_PATH, ensure_ascii=False, indent=2)
def get_table(name: str):
    return get_db().table(name)
