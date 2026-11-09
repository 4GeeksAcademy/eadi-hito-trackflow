# Progress — TrackFlow

## Estado actual
- La landing incorpora un boton flotante circular para volver al inicio, visible tras bajar 240 px, con flecha blanca, colores existentes y soporte de teclado y movimiento reducido. Solo aparece en la landing; verificado en Chromium a 1440 y 390 px, incluida la compilacion de produccion y la regresion del formulario publico.
- Inventario, Incidencias, Proveedores y Candidaturas comparten la franja de navegacion de Ops mediante `components/OpsSidebar.tsx`, reutilizando los estilos de Resumen. Incluye las acciones de cada seccion y los regresos al panel Ops y al inicio, sin enlaces de regreso duplicados en el contenido. Se verificaron enlaces, filtros, formularios y ausencia de solapamientos/desbordamientos a 1440, 900 y 390 px mediante la regresion Chromium existente; lint, tipos y compilacion correctos.
- La aplicacion activa de Ops esta en `auth-fullstack/frontend` y la API en `auth-fullstack/backend`. Ops, inventario, incidencias, proveedores, candidaturas y cuenta requieren el JWT existente, validado en servidor contra `/auth/me`, mediante cookie HttpOnly. La landing y el formulario comercial siguen publicos; `POST /api/records` conserva su acceso publico. Incidencias exige tambien autenticacion directamente en FastAPI. Se anadieron logout, caducidad y migracion de sesiones previas. Verificado con lint, tipos, compilacion, 38 tests backend y una regresion Chromium de produccion (ver `TESTING.md`).
- El dominio TypeScript raíz ya contiene modelos de productos, envíos, transportistas y movimientos de inventario.
- Existe una aplicación Next.js previa en `uis/talent-pipeline-tracker/`; se conserva sin duplicarla ni reemplazarla.
- La estructura de soporte para agentes ya está creada: banco de memoria, reglas, skill reutilizable y `AGENTS.md` raíz.
- `uis/website/` contiene la web pública responsive con captación de leads B2B y validación del formulario.
- `frontend/` contiene el backoffice (Next.js) — reemplaza `uis/backoffice/` (obsoleto).
- `backend/` contiene la API FastAPI con auth, usuarios, perfiles, proveedores y recuperación de contraseña — reemplaza `services/api/` (obsoleto).
- `auth/` contiene tipos y modelos compartidos (Python + TypeScript).
- `uis/backoffice/` y `services/api/` están obsoletos; se mantienen temporalmente para referencia.
- La estructura base del proyecto se reorganizó de `services/api/` + `uis/backoffice/` a `backend/` + `frontend/` + `auth/`.
- Se añadió un stack Docker local para `auth-fullstack/frontend`, `uis/incident-manager` y `auth-fullstack/backend`. En Codespaces, el bridge permite alcanzar el gateway del host pero no conexiones directas entre contenedores; las interfaces usan `host.docker.internal:8001` allí, y mantienen `backend:8000` para Docker normal/VPS. Ambos proxies llegan a FastAPI (responden 401 sin sesión); aún queda validar el networking nativo por nombre de servicio y desplegar al VPS.
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
4. Incorporar telemetría y tracking unificado; la autenticacion de Ops ya esta implementada.
5. Verificar `frontend/specs/` contra el `/docs` real cuando se incorpore el backend de operaciones.
6. Convertir la propuesta de `docs/ARCHITECTURE_PROPOSAL.md` en un servicio FastAPI cuando se aprueben los contratos y límites de dominio.
7. Conectar el analizador de incidencias a almacenamiento persistente y autenticación antes de usarlo con datos operativos reales.
8. Conectar el directorio de proveedores a autenticación y permisos antes de usarlo con datos operativos reales.
9. Rotar la clave JWT y configurar permisos de producción antes del despliegue.
10. Configurar `RESEND_API_KEY` en el entorno real del backend y verificar la entrega de un email de recuperación: actualmente no existe su archivo de entorno ni está definida esa variable. El endpoint devuelve 503 sin consultar usuarios cuando falta la configuración, en lugar de confirmar falsamente un envío. Se corrigió también la captura de excepciones del SDK de Resend. Validado con 40 pruebas backend, lint, tipos y Chromium; la entrega real queda bloqueada hasta disponer de la credencial.
11. Verificar conectividad entre servicios con networking bridge operativo y desplegar el stack en el VPS.
