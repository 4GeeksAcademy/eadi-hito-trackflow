# Services (histórico)

## `incident-api`

`services/incident-api` es la ruta canónica compatible del servicio de incidencias. Es un enlace simbólico hacia `auth-fullstack/backend`, que sigue siendo la implementación activa junto con autenticación, perfiles y proveedores. Así se cumple la estructura solicitada sin duplicar código ni romper imports.

```bash
cd services/incident-api
uv run uvicorn main:app --reload --port 8000
```

Los servicios backend históricos se mantienen aquí para futuras integraciones.

Cada servicio futuro debe documentar su contrato, variables de entorno, comando de validación y dependencia con los sistemas de almacén, ERP o transportistas que integre.
