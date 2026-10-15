# Auditoría de serialización FastAPI

Fecha: 2026-10-15  
Aplicación auditada: `auth-fullstack/backend/main.py` (servicio `backend` de `docker-compose.yml`).  
Alcance: rutas de negocio montadas por la aplicación. Las rutas de documentación generadas por FastAPI (`/docs`, `/redoc`, `/openapi.json` y `/docs/oauth2-redirect`) se excluyen porque son infraestructura de documentación, no endpoints de negocio.

## Criterios y resultado

Estado original: ✅ tenía un esquema de salida explícito y adecuado; ⚠️ tenía un esquema, pero exponía campos innecesarios o incompletos; ❌ no declaraba un `response_model` explícito. La tabla mantiene ese estado original y registra el contrato final en la última columna.

Los 35 endpoints de negocio quedan serializados explícitamente. Las respuestas 204 de borrado declaran `response_model=None`, ya que su contrato es no devolver cuerpo. Los demás usan un esquema Pydantic explícito.

| Método y ruta | Propósito / entrada | Respuesta actual | Estado original | Cambio / decisión |
| --- | --- | --- | :---: | --- |
| `POST /auth/login` | Iniciar sesión; `LoginRequest` | `TokenResponse` | ✅ | Se conserva; solo devuelve el token de acceso y su tipo. |
| `GET /auth/me` | Perfil autenticado | `AuthenticatedUser` | ✅ | Se conserva; incluye el email del propio usuario, necesario para su perfil. |
| `POST /auth/forgot-password` | Solicitar recuperación; `ForgotPasswordRequest` | `MessageResponse` | ❌ | Mensaje genérico tipado; no confirma ni devuelve el email. |
| `POST /auth/reset-password` | Restablecer contraseña; `ResetPasswordRequest` | `MessageResponse` | ❌ | Mensaje tipado sin email, contraseña ni token. |
| `POST /auth/change-password` | Cambiar contraseña autenticado; `ChangePasswordRequest` | `MessageResponse` | ❌ | Mensaje tipado sin datos de credenciales. |
| `GET /profiles/me` | Consultar perfil autenticado | `Profile` | ✅ | Se conserva como proyección plana; no anida el usuario. |
| `PUT /profiles/me` | Actualizar perfil; `ProfileInput` | `Profile` | ✅ | Entrada y salida separadas; respuesta plana. |
| `POST /users` | Registro; `UserCreate` | `UserRegistrationResponse` | ⚠️ | Reemplaza `UserResponse`, que incluía email, por un mensaje genérico sin email ni ID. |
| `GET /users` | Listar usuarios autenticado | `list[UserResponse]` | ✅ | Proyección plana; no incluye credenciales ni hash. |
| `GET /users/{user_id}` | Consultar usuario propio o admin | `UserResponse` | ✅ | Proyección plana; no incluye credenciales ni hash. |
| `PUT /users/{user_id}` | Actualizar usuario; `UserUpdate` | `UserResponse` | ✅ | Entrada separada de la respuesta; no incluye credenciales ni hash. |
| `DELETE /users/{user_id}` | Eliminar usuario | Sin cuerpo (204) | ❌ | Declara explícitamente `response_model=None`. |
| `POST /api/incidents` | Crear incidencia; `IncidentCreate` | `Incident` | ✅ | Se conserva. |
| `GET /api/incidents` | Listar y filtrar incidencias | `list[Incident]` | ✅ | Proyección plana; no hay objetos relacionados anidados. |
| `GET /api/incidents/summary` | Resumen por estado, categoría, origen y sede | `IncidentSummary` | ❌ | Esquema tipado con mapas de conteos por enum. |
| `GET /api/incidents/{incident_id}` | Consultar incidencia | `Incident` | ✅ | Se conserva. |
| `PATCH /api/incidents/{incident_id}/status` | Cambiar estado; `IncidentUpdateStatus` | `Incident` | ✅ | Entrada separada de la respuesta. |
| `POST /suppliers` | Crear proveedor; `SupplierCreate` | `Supplier` | ✅ | Se conserva; entrada y salida son modelos distintos. |
| `GET /suppliers` | Listar proveedores | `list[Supplier]` | ✅ | Proyección plana con campos usados por el directorio; sin objetos anidados. |
| `GET /suppliers/{supplier_id}` | Consultar proveedor | `Supplier` | ✅ | Se conserva como proyección plana. |
| `PATCH /suppliers/{supplier_id}/rate` | Actualizar tarifa; `SupplierUpdateRate` | `Supplier` | ✅ | Entrada separada de la respuesta. |
| `PATCH /suppliers/{supplier_id}/status` | Actualizar estado; `SupplierUpdateStatus` | `Supplier` | ✅ | Entrada separada de la respuesta. |
| `DELETE /suppliers/{supplier_id}` | Eliminar proveedor | Sin cuerpo (204) | ❌ | Declara explícitamente `response_model=None`. |
| `POST /api/suppliers` | Crear proveedor; `SupplierCreate` | `Supplier` | ✅ | Alias de API montado con el mismo esquema y handler. |
| `GET /api/suppliers` | Listar proveedores | `list[Supplier]` | ✅ | Alias de API; proyección plana. |
| `GET /api/suppliers/{supplier_id}` | Consultar proveedor | `Supplier` | ✅ | Alias de API; proyección plana. |
| `PATCH /api/suppliers/{supplier_id}/rate` | Actualizar tarifa; `SupplierUpdateRate` | `Supplier` | ✅ | Alias de API; entrada separada de la respuesta. |
| `PATCH /api/suppliers/{supplier_id}/status` | Actualizar estado; `SupplierUpdateStatus` | `Supplier` | ✅ | Alias de API; entrada separada de la respuesta. |
| `DELETE /api/suppliers/{supplier_id}` | Eliminar proveedor | Sin cuerpo (204) | ❌ | Alias de API; declara `response_model=None`. |
| `GET /inventory/products` | Listar SKU con stock calculado | `list[SKUResponse]` | ✅ | Campos planos del SKU y stock; sin relación anidada. |
| `POST /inventory/products` | Crear SKU; `SKUCreate` | `SKUResponse` | ✅ | Entrada separada de la respuesta; stock calculado por el servidor. |
| `GET /inventory/products/{id}` | Consultar SKU | `SKUResponse` | ✅ | Se conserva. |
| `POST /inventory/orders/inbound` | Registrar entrada; `StockEntryCreate` | `StockEntryResponse` | ✅ | Entrada separada; `sku_id` y `user_uuid` se conservan como referencias planas del movimiento. |
| `POST /inventory/orders/outbound` | Registrar salida; `StockExitCreate` | `StockExitResponse` | ✅ | Entrada separada; las referencias del movimiento se conservan planas. |
| `GET /inventory/orders` | Listar movimientos | `list[InventoryOrderResponse]` | ✅ | Proyección plana con datos del SKU que consume la tabla; `sku_id` y `user_uuid` se mantienen como identificadores, no como credenciales ni tokens. |

## Seguridad y relaciones

- Ninguna respuesta expone `password` ni `hashed_password`. Los esquemas de entrada reciben contraseñas solo en las operaciones que las necesitan.
- Las respuestas de registro, login, recuperación y restablecimiento no reenvían el email. Login devuelve únicamente el token necesario; `GET /auth/me` devuelve el email del usuario autenticado.
- El email de contacto de un proveedor no es el email de autenticación de un usuario y forma parte de la ficha del proveedor.
- Las relaciones de movimientos de inventario se representan planas: `sku_id` conserva la referencia del producto y la lista añade `sku`, `name` y `client_name` para la tabla. No se serializa un objeto SKU completo. `user_uuid` es un identificador de auditoría usado por la UI, no un token de autenticación.
- Perfiles, incidencias, productos y proveedores se devuelven como proyecciones planas; no hay objetos ORM anidados en sus respuestas.

## Verificación final

- Suite existente del backend: `python -m pytest` — 29 aprobados.
- Cobertura HTTP añadida para registro, login, recuperación y restablecimiento; comprueba que esas respuestas no incluyan email o credenciales.
- El servicio local responde `200` en `/docs` y `/openapi.json`; el OpenAPI publica 35 operaciones de negocio y no hay respuestas de éxito sin esquema JSON ni respuestas 204 con cuerpo.
- Comprobaciones HTTP de solo lectura: `GET /inventory/products` (200, lista), `GET /api/incidents/summary` (200, cuatro proyecciones tipadas) y `GET /api/incidents` (200, lista de incidencias).
- Verificación interactiva en Swagger UI con “Try it out” y “Execute”: `GET /inventory/products` devolvió 200 y una lista; `GET /api/incidents/summary` devolvió 200 con los cuatro grupos de conteos; `GET /api/incidents` devolvió 200 con una lista de incidencias. Los tres cuerpos coinciden con los esquemas mostrados.
