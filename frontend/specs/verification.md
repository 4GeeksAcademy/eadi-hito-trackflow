# Verificación de la especificación

- Se ejecutó una exploración del repositorio y no se encontró backend bajo `services/`, contrato OpenAPI ni ruta `/docs`.
- El patrón de fetch existente revisado es `uis/talent-pipeline-tracker/lib/api.ts`; pertenece a la funcionalidad de candidatos y no define estos contratos operativos.
- Las rutas `/api/facets`, `/api/alerts` y `/api/top-categories` son propuestas de frontend, no endpoints verificados.
- Los tipos y parámetros se validan localmente con TypeScript estricto; la validación contra OpenAPI queda pendiente de la incorporación del backend.
