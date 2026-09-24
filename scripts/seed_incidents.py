from __future__ import annotations

import csv
import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "auth-fullstack" / "backend"))
sys.path.insert(0, str(ROOT))

from database import get_db  # noqa: E402
from models import IncidentCreate  # noqa: E402
from packages.shared.incident_validation import transform_csv_row  # noqa: E402

CSV_PATH = Path(os.environ.get("INCIDENTS_CSV", ROOT / "content/contexts/incidents-file-analysis/incidents-trackflow.csv"))


def main() -> None:
    if not CSV_PATH.exists():
        print(f"CSV no encontrado: {CSV_PATH}")
        raise SystemExit(1)
    invalid = 0
    inserted = 0
    with get_db() as db, CSV_PATH.open(newline="", encoding="utf-8") as source:
        table = db.table("incidents")
        existing_by_source = {item.get("source_id") for item in table.all()}
        for row in csv.DictReader(source):
            try:
                transformed = transform_csv_row(row)
                source_id = str(transformed.pop("source_id"))
                if source_id in existing_by_source:
                    continue
                payload = IncidentCreate(**{key: transformed[key] for key in ("title", "description", "status", "category", "origin", "branch")})
                table.insert({**payload.model_dump(mode="json"), "source_id": source_id, "created_at": transformed["created_at"], "updated_at": transformed["updated_at"]})
                existing_by_source.add(source_id)
                inserted += 1
            except (ValueError, TypeError) as error:
                invalid += 1
                print(f"Fila inválida descartada: {error}")
    print(f"Seed finalizado: {inserted} insertadas, {invalid} inválidas, duplicadas omitidas.")


if __name__ == "__main__":
    main()
