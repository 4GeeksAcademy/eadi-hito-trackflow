# Progress — TrackFlow

## Estado actual
- El dominio TypeScript raíz ya contiene modelos de productos, envíos, transportistas y movimientos de inventario.
- Existe una aplicación Next.js previa en `uis/talent-pipeline-tracker/`; se conserva sin duplicarla ni reemplazarla.
- La estructura de soporte para agentes ya está creada: banco de memoria, reglas, skill reutilizable y `AGENTS.md` raíz.
- `uis/website/` contiene la web pública responsive con captación de leads B2B y validación del formulario.
- `frontend/` contiene el backoffice (Next.js) — reemplaza `uis/backoffice/` (obsoleto).
- `backend/` contiene la API FastAPI con auth, usuarios, perfiles, proveedores y recuperación de contraseña — reemplaza `services/api/` (obsoleto).
- `auth/` contiene tipos y modelos compartidos (Python + TypeScript).
- `uis/backoffice/` y `services/api/` están obsoletos; se mantienen temporalmente para referencia.
- La estructura base del proyecto se reorganizó de `services/api/` + `uis/backoffice/` a `backend/` + `frontend/` + `auth/`.
- El backend `backend/` funciona correctamente con:
  - ✅ Login (JWT)
  - ✅ Forgot-password (envío de email vía Resend)
  - ✅ Reset-password (token JWT de un solo uso)
  - ✅ Change-password
  - ✅ CRUD de usuarios y perfiles
  - ✅ CRUD de proveedores
  - Entorno virtual creado con bcrypt 3.2.2 (compatible con passlib 1.7.4)

## Próximos pasos
1. Instalar las librerías gráficas del contenedor para completar smoke tests Playwright; los servidores ya arrancan correctamente.
2. Sustituir datos mock del backoffice por servicios bajo `services/` cuando exista backend.
3. Añadir persistencia y envío real del formulario de leads.
4. Incorporar telemetría, tracking unificado y autenticación del backoffice.
5. Verificar `frontend/specs/` contra el `/docs` real cuando se incorpore el backend de operaciones.
6. Convertir la propuesta de `docs/ARCHITECTURE_PROPOSAL.md` en un servicio FastAPI cuando se aprueben los contratos y límites de dominio.
7. Conectar el analizador de incidencias a almacenamiento persistente y autenticación antes de usarlo con datos operativos reales.
8. Conectar el directorio de proveedores a autenticación y permisos antes de usarlo con datos operativos reales.
9. Rotar la clave JWT y configurar permisos de producción antes del despliegue.
10. Configurar una clave Resend real y verificar el envío de un email de recuperación.
