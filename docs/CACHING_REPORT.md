# Informe de optimización y caché

Fecha: 2026-10-14  
Aplicaciones: `auth-fullstack/frontend` y `auth-fullstack/backend`.

Las frecuencias de abajo son estimaciones derivadas de los flujos actuales de UI y API; todavía no hay telemetría de producción. Coste: bajo = acceso puntual/simple; medio = recorrido, filtrado, validación o hashing; alto = agregación o consultas repetidas por elemento. La evaluación cubre las 35 rutas de negocio montadas por FastAPI, incluidos los alias `/api/suppliers`.

## Decisiones en el frontend

- `CandidateForm` se carga con `next/dynamic` en `/candidates` y `/candidates/[id]`. El componente no es necesario en la vista inicial: solo aparece al pulsar “Nueva candidatura” o “Editar candidatura”. Así, ambas rutas pueden diferir el formulario hasta la interacción. Su archivo fuente mide 7.398 bytes; es una referencia del módulo, no una medición del ahorro comprimido del bundle.
- En `/inventory/products`, `stockMetrics` usa `useMemo` sobre `products` para calcular unidades totales y SKU con stock bajo en un único recorrido. Antes eran dos recorridos completos (`reduce` y `filter`) en cada render. Con $N$ productos se pasa de hasta $2N$ visitas a $N$ cuando cambia el catálogo, y los cambios de búsqueda/filtros ya no recalculan esos KPIs mientras `products` conserve su referencia.
- El filtro de productos ya estaba memoizado con dependencias `[products, search, warehouse]`; el cálculo agregado nuevo depende solo de `[products]`, que es la dependencia correcta para esos KPIs.
- No se difieren tablas pequeñas ni los controles principales: son visibles al entrar a la pantalla y el coste de ocultarlas supera el ahorro esperado.

## Evaluación de endpoints

| Método y ruta | Coste | Frecuencia estimada | Cambio de datos | Decisión |
| --- | --- | --- | --- | --- |
| `POST /auth/login` | Medio-alto (hash de contraseña) | Alta al iniciar sesión | Baja-media | No cachear: credenciales y resultado de sesión. |
| `GET /auth/me` | Bajo (usuario y perfil puntuales) | Alta durante navegación autenticada | Media | No cachear: respuesta de sesión, propia del usuario. |
| `POST /auth/forgot-password` | Medio (proveedor de email) | Baja | Baja | No cachear: respuesta de seguridad y efecto externo. |
| `POST /auth/reset-password` | Medio (validación/hash/escritura) | Baja | Por operación | No cachear: token de un solo uso. |
| `POST /auth/change-password` | Medio (hash/escritura) | Baja | Por operación | No cachear: datos de credenciales. |
| `GET /profiles/me` | Bajo (lectura puntual) | Media-alta | Baja-media | No cachear: datos personales y propios del usuario. |
| `PUT /profiles/me` | Bajo (escritura puntual) | Baja | Por operación | No cachear: escritura de datos personales. |
| `POST /users` | Medio (hash y alta) | Baja | Por operación | No cachear: registro y email. |
| `GET /users` | Medio (recorrido de usuarios) | Baja | Baja-media | No cachear: lista de emails y roles. |
| `GET /users/{user_id}` | Bajo (lectura puntual) | Baja-media | Baja-media | No cachear: datos de identidad/autorización. |
| `PUT /users/{user_id}` | Bajo-medio (escritura) | Baja | Por operación | No cachear: actualiza identidad o permisos. |
| `DELETE /users/{user_id}` | Bajo (borrado puntual) | Baja | Por operación | No cachear: escritura de identidad. |
| `POST /api/incidents` | Medio (validación y escritura TinyDB) | Media | Por operación | No cachear: mutación; invalida el resumen. |
| `GET /api/incidents` | Medio (recorrido y filtros O(N)) | Alta al abrir y filtrar la pantalla | Alta | No cachear: descripciones operativas y cambios frecuentes. |
| `GET /api/incidents/summary` | Alto (recorrido y cuatro agregaciones O(N)) | Alta al abrir y tras cambiar estado | Baja-media, ligada a escrituras | Cachear 30 s; invalidación al crear, cambiar estado o limpiar incidencias. |
| `GET /api/incidents/{incident_id}` | Bajo (lectura puntual TinyDB) | Baja-media | Media | No cachear: detalle y estado mutable; poco beneficio frente al coste. |
| `PATCH /api/incidents/{incident_id}/status` | Medio (lectura, transición y escritura) | Media | Por operación | No cachear: mutación; invalida el resumen. |
| `POST /suppliers` | Bajo-medio (alta TinyDB) | Baja | Baja | No cachear: mutación; invalida listados. |
| `GET /suppliers` | Medio (recorrido y filtros O(N)) | Media-alta al abrir/cambiar filtros | Baja | Cachear 30 s por usuario y filtros; invalidar ante cualquier escritura de proveedor. |
| `GET /suppliers/{supplier_id}` | Bajo (lectura puntual) | Baja; la UI actual consume el listado | Baja | No cachear: baja frecuencia y contiene contacto/notas comerciales. |
| `PATCH /suppliers/{supplier_id}/rate` | Bajo-medio (lectura y escritura) | Baja | Por operación | No cachear: mutación; invalida listados. |
| `PATCH /suppliers/{supplier_id}/status` | Bajo-medio (lectura y escritura) | Baja | Por operación | No cachear: mutación; invalida listados. |
| `DELETE /suppliers/{supplier_id}` | Bajo (borrado puntual) | Baja | Por operación | No cachear: mutación; invalida listados. |
| `POST /api/suppliers` | Bajo-medio (alias de alta) | Baja | Por operación | No cachear: mutación; invalida listados. |
| `GET /api/suppliers` | Medio (alias del recorrido y filtros O(N)) | Media-alta | Baja | Misma caché TTL por usuario/filtros que `/suppliers`. |
| `GET /api/suppliers/{supplier_id}` | Bajo (alias de lectura puntual) | Baja | Baja | No cachear: baja frecuencia y contiene contacto/notas comerciales. |
| `PATCH /api/suppliers/{supplier_id}/rate` | Bajo-medio (alias de escritura) | Baja | Por operación | No cachear: mutación; invalida listados. |
| `PATCH /api/suppliers/{supplier_id}/status` | Bajo-medio (alias de escritura) | Baja | Por operación | No cachear: mutación; invalida listados. |
| `DELETE /api/suppliers/{supplier_id}` | Bajo (alias de borrado puntual) | Baja | Por operación | No cachear: mutación; invalida listados. |
| `GET /inventory/products` | Alto (dos agregados SQL por SKU) | Alta al abrir inventario | Alta: cada movimiento de stock | No cachear: stock cambiante y datos comerciales/operativos. |
| `POST /inventory/products` | Medio (validación, duplicado y escritura SQL) | Baja | Por operación | No cachear: escritura del catálogo. |
| `GET /inventory/products/{id}` | Medio (SKU y dos agregados SQL) | Baja-media | Alta: cada movimiento de stock | No cachear: inventario operativo mutable. |
| `POST /inventory/orders/inbound` | Medio (validación y escritura SQL) | Media | Por operación | No cachear: movimiento de stock. |
| `POST /inventory/orders/outbound` | Medio-alto (agregados, validación y escritura SQL) | Media | Por operación | No cachear: movimiento de stock y trazabilidad. |
| `GET /inventory/orders` | Alto (recorrido y consulta de SKU por movimiento) | Media-alta al abrir historial | Alta | No cachear: órdenes, seguimiento y UUID de auditoría. |

## Decisiones en el backend

La implementación usa `TTLCache` en memoria, con reloj monotónico y bloqueo para proteger el diccionario entre hilos. El TTL común es de 30 segundos.

- `GET /api/incidents/summary`: la clave es global porque el valor es un agregado sin identificadores ni detalle por usuario. La agregación recorre incidencias y calcula cuatro distribuciones; la vista la consulta al entrar y después de cambiar un estado. Se invalida tras crear, actualizar estado o limpiar incidencias.
- `GET /suppliers` y alias `GET /api/suppliers`: clave `(suppliers, list, user_id, country, category)`. La lista recorre TinyDB y aplica filtros; la UI vuelve a consultarla al abrir la sección y cambiar filtros. Incluye email de contacto y notas comerciales, por lo que el usuario autenticado forma parte de la clave. Se invalida después de crear, cambiar tarifa, cambiar estado o borrar un proveedor.
- No se almacenan respuestas de login, perfiles, usuarios, incidencias completas, stock ni órdenes. La caché de proveedores no usa una clave compartida entre usuarios.
- La caché es por proceso. En un despliegue con varios workers, una escritura solo invalida la memoria del worker que la procesó; el TTL limita la antigüedad restante a 30 segundos, pero para invalidación inmediata entre workers habría que sustituirla por Redis u otro almacén compartido.

## Frescura frente a rendimiento

El TTL de 30 segundos limita la antigüedad de una lectura aun si los datos se cambian fuera de estas rutas. En el flujo normal de la API, la invalidación explícita hace que la siguiente lectura vea inmediatamente el cambio. Es un margen razonable para el directorio de proveedores y los KPIs agregados: reduce recorridos repetidos sin retenerlos durante una sesión operativa. No aplicamos ese margen al inventario, cuyo stock cambia con cada entrada o salida y necesita reflejarse inmediatamente.

## Qué no se cacheó y por qué

- `GET /inventory/products` parece atractivo por sus dos consultas de agregación por SKU, pero devuelve cliente, catálogo y stock, que cambia con cada movimiento. Se priorizan frescura y confidencialidad sobre el ahorro de consultas.
- `GET /api/incidents` contiene descripciones operativas y cambia con frecuencia; además su coste es menor que recalcular el resumen agregado y no compensa guardar el detalle.
- `GET /auth/me` y `GET /profiles/me` son propios de cada sesión. Una clave compartida sería incorrecta; no se cachean ni siquiera con TTL.

## Verificación

- Backend: `python -m pytest` — 33 aprobados. Incluye expiración TTL, reutilización de entradas, aislamiento de claves por usuario, invalidación por prefijo, refresco del resumen tras crear/cambiar estado y refresco del listado de proveedores tras crear/cambiar tarifa/cambiar estado/borrar.
- Frontend: `npm run build` compiló Next.js y TypeScript; `npm run lint` terminó sin errores.
- Playwright en `http://localhost:3000`: en `/candidates`, “Nueva candidatura” mostró el formulario y solicitó un chunk JS adicional; en `/candidates/lazy-test`, con respuestas de API interceptadas sin persistencia, “Editar candidatura” mostró el formulario. No hubo errores de página.
- `/inventory/products` redirigió a login al no haber sesión, así que no se inspeccionó visualmente el KPI en ese navegador; el cálculo memoizado quedó cubierto por build, lint y revisión de dependencias `[products]`.
- La estimación frontend se basa en el tamaño fuente medido y en el patrón condicional; no se afirma una mejora de LCP/FCP medida en producción porque aún no hay análisis de bundle ni telemetría.
