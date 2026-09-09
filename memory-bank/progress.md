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

## Próximos pasos
1. Instalar las librerías gráficas del contenedor para completar smoke tests Playwright; los servidores ya arrancan correctamente.
2. Sustituir datos mock del backoffice por servicios bajo `services/` cuando exista backend.
3. Añadir persistencia y envío real del formulario de leads.
4. Incorporar telemetría, tracking unificado y autenticación del backoffice.
