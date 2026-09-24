## Estructura del gestor de incidencias

Las rutas canónicas del hito son:

```text
scripts/seed_incidents.py
packages/shared/
services/incident-api/  -> auth-fullstack/backend
uis/incident-manager/   -> auth-fullstack/frontend
```

Las dos últimas son enlaces simbólicos de compatibilidad: el código no se duplica y la aplicación existente conserva sus comandos, imports y funcionalidades de autenticación.
# TrackFlow

## Variables de recuperación de contraseña

Configura estas variables en `backend/.env` (ese archivo está ignorado por Git): `JWT_SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `PASSWORD_RESET_EXPIRE_MINUTES`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` y `FRONTEND_URL`. La clave `RESEND_API_KEY` se utiliza únicamente para enviar el enlace mediante Resend.

## Estructura del proyecto

```
backend/           → API FastAPI (Python)
frontend/          → Aplicación Next.js (TypeScript)
auth/              → Tipos y modelos compartidos (Python + TypeScript)
services/api/      → (obsoleto)
uis/backoffice/    → (obsoleto)
```

Landing corporativa y formulario de solicitud de información para TrackFlow.

## Ejecutar localmente

Desde la raíz del proyecto, ejecuta:

```bash
npx http-server . -p 3000 -a 0.0.0.0
```

En Codespaces, abre el puerto `3000` desde la pestaña **Ports**. De forma local,
visita `http://127.0.0.1:3000/`.