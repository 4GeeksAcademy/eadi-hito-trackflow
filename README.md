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

## Ejecutar el proyecto completo en local

El proyecto se ejecuta con dos procesos independientes: una API FastAPI y una
aplicación Next.js. Abre dos terminales y sigue los pasos en este orden.

### 1. Configurar las variables de entorno del backend

Desde la raíz del repositorio, crea el archivo `auth-fullstack/backend/.env`
(no incluyas valores reales en el repositorio):

```bash
cd /workspaces/eadi-hito-trackflow
cat > auth-fullstack/backend/.env <<'EOF'
JWT_SECRET_KEY=pon_aqui_un_secreto_largo
ACCESS_TOKEN_EXPIRE_MINUTES=60
PASSWORD_RESET_EXPIRE_MINUTES=30
RESEND_API_KEY=pon_aqui_la_clave_de_resend
EMAIL_FROM=TrackFlow <onboarding@resend.dev>
FRONTEND_URL=http://localhost:3000
# Opcional: ruta absoluta del fichero TinyDB
# TRACKFLOW_DB_PATH=/ruta/absoluta/trackflow-db.json
EOF
```

Sustituye los valores de ejemplo por los valores de tu entorno antes de
levantar el backend. También existe una plantilla `.env.example`, pero debes
revisar y reemplazar sus valores antes de copiarla para no reutilizar secretos
o URLs de otro entorno.

```dotenv
JWT_SECRET_KEY=pon_aqui_un_secreto_largo
ACCESS_TOKEN_EXPIRE_MINUTES=60
PASSWORD_RESET_EXPIRE_MINUTES=30
RESEND_API_KEY=pon_aqui_la_clave_de_resend
EMAIL_FROM=TrackFlow <onboarding@resend.dev>
FRONTEND_URL=http://localhost:3000
# Opcional: ruta absoluta del fichero TinyDB
# TRACKFLOW_DB_PATH=/ruta/absoluta/trackflow-db.json
```

`JWT_SECRET_KEY`, `ACCESS_TOKEN_EXPIRE_MINUTES`, `PASSWORD_RESET_EXPIRE_MINUTES`
y `RESEND_API_KEY` son necesarias para las funciones de autenticación y
restablecimiento de contraseña. `EMAIL_FROM` y `FRONTEND_URL` controlan el
correo de recuperación. `TRACKFLOW_DB_PATH` es opcional; si se omite, se usa
la base TinyDB configurada por el backend.

### 2. Instalar y levantar el backend

En la **Terminal 1**, ejecuta los comandos desde esta carpeta exacta:

```bash
cd /workspaces/eadi-hito-trackflow/auth-fullstack/backend
python -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

El backend queda disponible en `http://localhost:8000`. La documentación
interactiva de FastAPI está en `http://localhost:8000/docs`.

En una instalación que ya tenga el entorno virtual creado, basta con:

```bash
cd /workspaces/eadi-hito-trackflow/auth-fullstack/backend
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Instalar y levantar el frontend

En la **Terminal 2**, ejecuta los comandos desde esta carpeta exacta:

```bash
cd /workspaces/eadi-hito-trackflow/auth-fullstack/frontend
npm install
npm run dev
```

El frontend queda disponible en `http://localhost:3000`. Sus rutas `/api/*`
se redirigen al backend local que escucha en el puerto `8000`.

En una instalación que ya tenga las dependencias descargadas, basta con:

```bash
cd /workspaces/eadi-hito-trackflow/auth-fullstack/frontend
npm run dev
```

En Codespaces, abre los puertos `3000` y `8000` desde la pestaña **Ports**.
La aplicación web se abre en `http://localhost:3000`.