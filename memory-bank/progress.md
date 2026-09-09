# Progress — TrackFlow

## Estado actual
- El dominio TypeScript raíz ya contiene modelos de productos, envíos, transportistas y movimientos de inventario.
- Existe una aplicación Next.js previa en `uis/talent-pipeline-tracker/`; se conserva sin duplicarla ni reemplazarla.
- La estructura de soporte para agentes ya está creada: banco de memoria, reglas, skill reutilizable y `AGENTS.md` raíz.
- `uis/website/` contiene la web pública responsive con captación de leads B2B y validación del formulario.
- `uis/backoffice/` contiene un layout interno independiente con KPIs, inventario, carriers, devoluciones y alertas demo.
- `services/README.md` fija el lugar para futuros servicios backend sin añadir APIs fuera de esa carpeta.

## Próximos pasos
1. Validar typecheck de la raíz y build de ambas UIs.
2. Sustituir datos mock del backoffice por servicios bajo `services/` cuando exista backend.
3. Añadir persistencia y envío real del formulario de leads.
4. Incorporar telemetría, tracking unificado y autenticación del backoffice.
