from __future__ import annotations

from sqlmodel import Session, select

from database import engine, initialize_inventory_schema
from inventory_models import SKU, StockEntry, StockExit

SKU_SEED = [
    {"name": "Zapatilla blanca clásica - Talla 42", "sku": "CLT-SNK-W-42", "client_name": "PureStep Footwear", "category": "fashion", "warehouse": "LA"},
    {"name": "Zapatilla blanca clásica - Talla 42", "sku": "CLT-SNK-W-42-Z", "client_name": "PureStep Footwear", "category": "fashion", "warehouse": "ZGZ"},
    {"name": "Auriculares inalámbricos Pro", "sku": "TEC-EAR-001", "client_name": "SoundWave Electronics", "category": "electronics", "warehouse": "LA"},
    {"name": "Sérum facial hidratante 30ml", "sku": "CSM-SRM-030", "client_name": "GlowLab Cosmetics", "category": "cosmetics", "warehouse": "ZGZ"},
    {"name": "Chino slim fit - marino 32/32", "sku": "CLT-CHN-N-32", "client_name": "UrbanThread", "category": "fashion", "warehouse": "LA"},
    {"name": "Cargador rápido USB-C 65W", "sku": "TEC-CHG-065", "client_name": "SoundWave Electronics", "category": "electronics", "warehouse": "ZGZ"},
]

# Seed counts produce net stocks: 100, 60, 34, 39, 16, 48 respectively.
ENTRY_SEED = [
    ("CLT-SNK-W-42", 100, "PO-2024-0098", "LA"),
    ("CLT-SNK-W-42", 25, "GR-LA-0234", "LA"),
    ("CLT-SNK-W-42-Z", 60, "PO-ZGZ-0102", "ZGZ"),
    ("TEC-EAR-001", 40, "PO-LA-0881", "LA"),
    ("CSM-SRM-030", 45, "GR-ZGZ-0310", "ZGZ"),
    ("CLT-CHN-N-32", 20, "PO-LA-0772", "LA"),
    ("TEC-CHG-065", 50, "GR-ZGZ-0550", "ZGZ"),
]
EXIT_SEED = [
    ("CLT-SNK-W-42", 25, "dispatch", "1Z999AA10123456784", "LA"),
    ("TEC-EAR-001", 6, "loss", None, "LA"),
    ("CSM-SRM-030", 6, "dispatch", "JD0146000123456789", "ZGZ"),
    ("CLT-CHN-N-32", 4, "dispatch", "1Z88TRACKFLOW000001", "LA"),
    ("TEC-CHG-065", 2, "loss", None, "ZGZ"),
]

SEED_USER_UUID = "00000000-0000-4000-8000-000000000001"


def seed_inventory() -> None:
    initialize_inventory_schema()
    with Session(engine) as session:
        for data in SKU_SEED:
            if session.exec(select(SKU).where(SKU.sku == data["sku"])).first() is None:
                session.add(SKU.model_validate(data))
        session.commit()
        skus = {item.sku: item for item in session.exec(select(SKU)).all()}
        for sku_code, quantity, reference, warehouse in ENTRY_SEED:
            if session.exec(select(StockEntry).where(StockEntry.reference == reference)).first() is None:
                session.add(StockEntry(sku_id=skus[sku_code].id, quantity=quantity,
                                       reference=reference, warehouse=warehouse,
                                       user_uuid=SEED_USER_UUID))
        session.commit()
        seeded_exit_keys = {
            (item.sku_id, item.exit_type, item.tracking_number, item.warehouse)
            for item in session.exec(select(StockExit)).all()
        }
        for sku_code, quantity, exit_type, tracking_number, warehouse in EXIT_SEED:
            sku_id = skus[sku_code].id
            exit_key = (sku_id, exit_type, tracking_number, warehouse)
            if exit_key not in seeded_exit_keys:
                session.add(StockExit(sku_id=sku_id, quantity=quantity, exit_type=exit_type,
                                      tracking_number=tracking_number, warehouse=warehouse,
                                      user_uuid=SEED_USER_UUID))
                seeded_exit_keys.add(exit_key)
        session.commit()


if __name__ == "__main__":
    seed_inventory()
    print("Inventario de desarrollo sembrado correctamente.")
