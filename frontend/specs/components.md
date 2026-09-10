# Especificación de componentes frontend

Esta especificación define contratos de presentación. No implementa componentes React ni llamadas HTTP.

## 1. Filtros y facetas

### `DateRangeFilter`

- **Propósito:** permitir un rango abierto o cerrado de fechas.
- **Props:** `DateRangeFilter` de `param-types.ts`.
- **Reglas:** las fechas se muestran y envían como `YYYY-MM-DD`; ambas son opcionales. Si se informan las dos, `startDate` no puede ser posterior a `endDate`.
- **Estado vacío:** mostrar “Todo el periodo” cuando no haya fechas.
- **Estado inválido:** mostrar un error junto al campo y no ejecutar la consulta.

### `FacetsSummary`

- **Propósito:** resumir la distribución B2B/B2C para el rango seleccionado.
- **Props:** `FacetsResponse` de `api-types.ts`.
- **Presentación:** dos valores separados, total y porcentaje, con texto visible “B2B” y “B2C”; no depender solo del color.
- **Estado sin datos:** mostrar el rango consultado y “No hay operaciones en este periodo”.
- **Estado parcial:** si un segmento tiene total cero, mostrar `0` y `0%`, sin ocultar el segmento.

## 2. Alertas y anomalías

### `AlertsTable`

- **Propósito:** presentar las anomalías operativas devueltas por `/api/alerts`.
- **Props:** `AlertsResponse` y, opcionalmente, el `AlertsParams` usado para solicitarla.
- **Columnas:** título, descripción, severidad, valor observado, umbral y fecha/hora.
- **Reglas:** severidad debe tener texto visible; el color es complementario. La fecha se formatea para la locale de la aplicación a partir de ISO 8601.
- **Estado vacío:** mostrar “No se detectaron anomalías” y conservar el rango y umbral seleccionados.
- **Estado de error o umbral inválido:** mostrar un mensaje accionable y no representar una tabla parcialmente vacía como si fuera éxito.

## 3. Categorías principales

### `TopCategoriesTable`

- **Propósito:** comparar categorías de producto entre B2B y B2C.
- **Props:** `TopCategoriesResponse` y `TopCategoriesParams`.
- **Columnas:** categoría, total B2B, porcentaje B2B, total B2C y porcentaje B2C.
- **Reglas:** ordenar según `operationType`; `limit` solo limita filas mostradas, no altera `total`.
- **Estado vacío:** mostrar “No hay categorías para este filtro”.
- **Estado límite:** si `limit` es 1, mostrar una sola fila y conservar el total general en el encabezado.

## Decisiones de contrato

- Los nombres de props siguen exactamente los tipos de `frontend/specs/`.
- No se agregan props de paginación, orden arbitrario o filtros de almacén porque no están descritos en el brief.
- Los contratos son provisionales: deben compararse con OpenAPI antes de implementar cualquier componente o cliente.
