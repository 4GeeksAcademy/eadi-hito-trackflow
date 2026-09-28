# Inventario TrackFlow (Hito 5)

El inventario SQLModel vive en este servicio, separado de los modelos de autenticación/Pydantic existentes. TinyDB sigue siendo la fuente de usuarios; no existe una tabla SQL de usuarios. Los SKU y movimientos incluyen `warehouse` (`LA` o `ZGZ`) y el stock se calcula por SKU y almacén como entradas menos salidas.

## Configuración local

En `auth-fullstack/backend/.env` (archivo local ignorado por Git), configura `DATABASE_URL` con la URL SQLAlchemy de PostgreSQL de Supabase, por ejemplo con el formato `postgresql+psycopg2://...`. No incluyas credenciales en el código, documentación versionada ni salidas de consola. El servicio usa una SQLite en memoria solo como fallback para desarrollo/tests si `DATABASE_URL` no está definida; no es persistencia para demo o producción.

Al iniciar la API se crean las tablas SQLModel. Para cargar de forma idempotente los datos de desarrollo (6 SKU, 7 entradas y 5 salidas), desde este directorio ejecuta:

```bash
uv run python inventory_seed.py
```

Saldos esperados en `/inventory/products`: `CLT-SNK-W-42` 100 (LA), `CLT-SNK-W-42-Z` 60 (ZGZ), `TEC-EAR-001` 34 (LA), `CSM-SRM-030` 39 (ZGZ), `CLT-CHN-N-32` 16 (LA), `TEC-CHG-065` 48 (ZGZ).

Las escrituras de SKU y movimientos requieren `Authorization: Bearer <token>`; las lecturas son públicas. Las salidas `dispatch` requieren `tracking_number`; las salidas `loss` lo prohíben. Los errores de stock insuficiente son HTTP 400 y se producen antes de insertar una salida.
