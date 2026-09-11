from __future__ import annotations

from datetime import datetime, timezone

try:
    from .database import get_db
    from .models import SupplierCreate
    from .seed_data import SUPPLIERS_SEED
except ImportError:  # Supports the installed `uv run seed` entry point.
    from database import get_db
    from models import SupplierCreate
    from seed_data import SUPPLIERS_SEED


def main() -> None:
    inserted = 0
    with get_db() as db:
        existing_names = {record["name"] for record in db.all()}
        for supplier_data in SUPPLIERS_SEED:
            if supplier_data["name"] in existing_names:
                continue
            supplier = SupplierCreate.model_validate(supplier_data)
            db.insert({**supplier.model_dump(mode="json"), "updated_at": datetime.now(timezone.utc).isoformat()})
            existing_names.add(supplier.name)
            inserted += 1
    print(f"Proveedores insertados: {inserted}")


if __name__ == "__main__":
    main()
