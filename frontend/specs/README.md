# Contrato de datos frontend

## Estado de verificación

Este repositorio no contiene backend ejecutable, archivo OpenAPI ni ruta `/docs` para estas funcionalidades. Por eso los contratos de este directorio son una **especificación provisional derivada de `recursos/quehacer.md`**, no una afirmación de compatibilidad con una API existente.

Antes de implementar componentes o clientes HTTP, el equipo debe comparar estos tipos con el `/docs` real y registrar cualquier cambio en un commit de tipos.

## Convenciones comunes

- Fechas de query: `YYYY-MM-DD`, opcionales y sin hora.
- Fechas de respuesta: ISO 8601 cuando incluyen hora.
- Segmentos válidos: `B2B` y `B2C`.
- Las respuestas usan `entries` para colecciones tabulares y `total` para el total antes del límite visual.
- El patrón de fetch existente en `uis/talent-pipeline-tracker/lib/api.ts` devuelve JSON tipado y convierte respuestas no exitosas en errores; esta spec no lo modifica ni lo reutiliza todavía.

## 1. Facetas B2B/B2C

### Endpoint propuesto

`GET /api/facets?startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}`

La ruta es propuesta a partir del wording del checklist; no está verificada contra `/docs` porque `/docs` no existe en esta rama.

### Request y response

- Request: `DateRangeFilter` de `param-types.ts`.
- Response: `FacetsResponse` de `api-types.ts`.
- `dateRange` devuelve el rango efectivo.
- `b2b` y `b2c` devuelven `total` y `percentage`.

### Restricciones

- Se permite omitir una o ambas fechas.
- Si se envían ambas, `startDate` debe ser menor o igual que `endDate`.
- `percentage` está entre 0 y 100.

### Casos límite

1. **Sin fechas:** la UI muestra “Todo el periodo” y presenta el rango efectivo que devuelva la API.
2. **Rango sin operaciones:** la UI mantiene ambas vistas y muestra `0`/`0%`, sin presentar error.

## 2. Alertas y anomalías

### Endpoint propuesto

`GET /api/alerts?threshold={number}&startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}`

La ruta y la semántica del umbral deben confirmarse contra `/docs` cuando exista.

### Request y response

- Request: `AlertsParams` de `param-types.ts`.
- Response: `AlertsResponse` de `api-types.ts`.
- `threshold` es opcional en la petición y obligatorio en la respuesta efectiva.
- `entries` contiene `AlertEntry`; `total` precede cualquier límite visual.

### Restricciones

- `threshold` debe ser un número mayor o igual que cero.
- `severity` solo puede ser `low`, `medium`, `high` o `critical`.
- `occurredAt` debe ser ISO 8601.

### Casos límite

1. **Sin anomalías:** la UI muestra “No se detectaron anomalías”, el rango y el umbral aplicado.
2. **Umbral inválido o fuera de rango:** la UI muestra error accionable y no trata la respuesta como una tabla vacía exitosa.

## 3. Categorías principales B2B/B2C

### Endpoint propuesto

`GET /api/top-categories?operationType={B2B|B2C}&limit={1..100}&startDate={YYYY-MM-DD}&endDate={YYYY-MM-DD}`

La ruta y los valores exactos son provisionales hasta disponer de `/docs`.

### Request y response

- Request: `TopCategoriesParams` de `param-types.ts`.
- Response: `TopCategoriesResponse` de `api-types.ts`.
- `operationType` selecciona el segmento de ordenación.
- `limit` limita las filas devueltas o mostradas según el contrato final.
- Cada `CategoryEntry` conserva métricas B2B y B2C para comparar ambos segmentos.

### Restricciones

- `operationType` es obligatorio y solo acepta `B2B` o `B2C`.
- `limit` debe ser entero entre 1 y 100 cuando se informa.
- Los porcentajes están entre 0 y 100.

### Casos límite

1. **`limit=1`:** la UI muestra una sola categoría y conserva `total` para informar cuántas existen en total.
2. **Sin categorías:** la UI muestra “No hay categorías para este filtro” y conserva el segmento y rango seleccionados.

## Desajustes a resolver con `/docs`

| Brief del PM | Estado actual | Resolución en esta spec |
| --- | --- | --- |
| “Facets” | No hay endpoint publicado | Se propone `/api/facets` y se marca provisional. |
| “Threshold” de alertas | No se define unidad ni escala | Se tipa como número no negativo; la unidad debe confirmarse. |
| “Tipo de operación” | El brief no enumera valores | Se fija provisionalmente `B2B | B2C`, coherente con las tres funcionalidades. |
| Categorías | No se define si porcentajes son de operaciones o unidades | Se documentan como porcentajes del volumen de cada segmento; confirmar con OpenAPI. |

## Checklist de verificación

- [x] Tipos separados de componentes y clientes.
- [x] Sin `any` ni `object` en los tipos.
- [x] JSDoc en cada propiedad de los tipos.
- [ ] Contraste contra `/docs` real, bloqueado porque todavía no existe backend/API en esta rama.
- [ ] Implementación React o fetch, fuera del alcance de esta tarea.
