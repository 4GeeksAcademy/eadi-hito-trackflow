# Progress — TrackFlow

## Estado actual
- El dominio TypeScript raíz ya contiene modelos de productos, envíos, transportistas y movimientos de inventario.
- Existe una aplicación Next.js previa en `uis/talent-pipeline-tracker/`; se conserva sin duplicarla ni reemplazarla.
- La estructura de soporte para agentes ya está creada: banco de memoria, reglas, skill reutilizable y `AGENTS.md` raíz.
- `uis/website/` contiene la web pública responsive con captación de leads B2B y validación del formulario.
- `uis/backoffice/` contiene un layout interno independiente con KPIs, inventario, carriers, devoluciones y alertas demo.
- `services/README.md` fija el lugar para futuros servicios backend sin añadir APIs fuera de esa carpeta.
- Se buscaron y cargaron las skills comunitarias `accessibility`, `vercel-react-best-practices` y `webapp-testing` en `.agents/skills/`.
- El dashboard recibió mejoras trazables de accesibilidad: skip link, navegación semántica, foco visible, caption/scope de tabla, iconos decorativos ocultos y estados con texto.
- Se añadió viewport explícito y se redujeron estilos inline del backoffice siguiendo las recomendaciones aplicables de Vercel.
- La skill interna `.skills/trackflow-dashboard-delivery/` documenta QA previo a entrega con typecheck, lint, build y smoke tests HTTP/Playwright.
- En `feature/frontend-specs` se añadió la especificación frontend de facets, alertas y categorías en `frontend/specs/`, con tipos TypeScript estrictos, parámetros, componentes, contrato de datos y rastro de verificación.
- La exploración confirmó que esta rama no contiene backend ni `/docs`; por eso el contrato queda marcado como provisional y sus desajustes están documentados para reconciliarse con OpenAPI.
- En `feature/propuesta-arquitectura-backend` se completó `docs/ARCHITECTURE_PROPOSAL.md` con una propuesta de monolito modular FastAPI en capas, estructura por dominio, routers, separación frontend/backend, CORS, configuración por entorno y riesgos específicos de TrackFlow.
- En `feature/analizador-incidentes` se añadió el analizador basado en el CSV real `scripts/incidents-TRACKFLOW.csv`: script CLI, lógica compartida, API FastAPI y pantalla `/incidents` del backoffice.
- El dataset produce 100 registros procesados, 98 válidos, 2 inválidos (`missing_field`, `invalid_category`, `invalid_email`), estados `CLOSED=53`, `DISCARDED=14`, `OPEN=31` y satisfacción media de cierres puntuados `3.06`.
- En `feature/analizador-incidentes` se añadió el directorio de proveedores del `CONTEXT_4`: modelos Pydantic, TinyDB persistente, CRUD FastAPI, seeder idempotente con `uv run seed` y página `/suppliers` con filtros y edición operativa.

## Próximos pasos
1. Instalar las librerías gráficas del contenedor para completar smoke tests Playwright; los servidores ya arrancan correctamente.
2. Sustituir datos mock del backoffice por servicios bajo `services/` cuando exista backend.
3. Añadir persistencia y envío real del formulario de leads.
4. Incorporar telemetría, tracking unificado y autenticación del backoffice.
5. Verificar `frontend/specs/` contra el `/docs` real cuando se incorpore el backend de operaciones.
6. Convertir la propuesta de `docs/ARCHITECTURE_PROPOSAL.md` en un servicio FastAPI cuando se aprueben los contratos y límites de dominio.
7. Conectar el analizador de incidencias a almacenamiento persistente y autenticación antes de usarlo con datos operativos reales.
8. Conectar el directorio de proveedores a autenticación y permisos antes de usarlo con datos operativos reales.
