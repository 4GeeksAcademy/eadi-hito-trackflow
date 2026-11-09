## Gestor de incidencias

La cobertura específica está en `auth-fullstack/backend/tests/test_incidents.py` e incluye creación, listado, filtros, detalle 404, resumen vacío, transiciones válidas/ inválidas y validación de payload.

```bash
cd auth-fullstack/backend
uv run pytest tests/test_incidents.py
```

El frontend de incidencias se valida con `npm run lint` y `npm run build` desde `auth-fullstack/frontend`. El CSV histórico está en `content/contexts/incidents-file-analysis/incidents-trackflow.csv`. El seed localizó 100 filas: 99 válidas y 1 inválida (`TRF-000042`, categoría vacía), por lo que cargó 99 incidencias. La distribución real del fichero difiere de los totales de referencia de `CONTEXT_5.md` (que habla de 95 registros); se conserva el CSV sin alterar y se reporta esa discrepancia.
# Plan y ejecución de pruebas

## Acceso autenticado a Ops

Desde `auth-fullstack/backend`, con las dependencias existentes de desarrollo,
los `node_modules` del frontend y Chromium de Playwright disponibles:

```bash
python -m pytest -q
TRACKFLOW_BROWSER_TESTS=1 python -m pytest tests/test_ops_access.py -q
```

La prueba de navegador compila y arranca Next.js y FastAPI en puertos libres,
con una TinyDB temporal y una cache de compilacion aislada. Comprueba el
formulario comercial sin sesion, validaciones y envio, redireccion desde la
landing y URL directa, APIs internas, login, cookie HttpOnly, navegacion con
sesion, compatibilidad con tokens anteriores, logout y caducidad sin excepciones
JavaScript. No crea usuarios permanentes ni envia correos reales.

Resultado: 38 pruebas backend correctas y una prueba de navegador correcta.
La prueba de navegador se omite por defecto si no se activa la variable.

La misma regresion verifica la barra lateral compartida de Inventario,
Incidencias, Proveedores y Candidaturas a 1440, 900 y 390 px: enlaces de
acciones y regreso, ausencia de regresos duplicados, filtros existentes,
apertura del formulario de candidaturas y ausencia de desbordamiento horizontal.
Las capturas quedan en `/tmp/trackflow-sidebar-review/`.

Tambien comprueba el boton flotante de la landing a 1440 y 390 px: oculto al
inicio, visible tras scroll o navegacion por secciones, retorno al principio,
activacion por teclado, preferencia de movimiento reducido y ausencia en las
paginas internas.

## Cómo ejecutar las pruebas

Desde la raíz del repositorio:

```bash
cd auth-fullstack/backend
uv run pytest
uv run pytest --cov=auth_service --cov=auth_dependencies --cov=password_reset_service --cov=routes.auth --cov-report=term-missing
```

El comando de cobertura limita el informe a los módulos de autenticación para comprobar el objetivo del checklist. Los tests usan una TinyDB temporal y nunca modifican `backend/data/`.

## Casos planificados antes de escribir los tests

Para cada endpoint y pieza de autenticación se cubrieron:

- **Registro (`POST /users`, lógica `create_user`)**: creación válida, email duplicado y contraseña con menos de ocho caracteres.
- **Login (`POST /auth/login`)**: credenciales válidas, contraseña incorrecta y email inexistente.
- **Usuario autenticado (`GET /auth/me`, lógica JWT)**: token válido y token expirado.
- **Olvido de contraseña (`POST /auth/forgot-password`)**: email no registrado con respuesta genérica para no revelar cuentas.
- **Restablecimiento (`POST /auth/reset-password`)**: token válido, token malformado, token reutilizado y actualización efectiva de la contraseña.
- **Cambio de contraseña (`POST /auth/change-password`)**: contraseña actual válida y contraseña actual incorrecta.
- **Utilidades de autenticación**: actualización de usuario inexistente, generación/verificación de hash y consumo único del token.

Los casos se enfocan en decisiones de negocio. No se prueban serialización HTTP, routing ni detalles internos de FastAPI.

## Cobertura y resultados

La batería está organizada en `auth-fullstack/backend/tests/`, con nombres descriptivos y fixtures aislados.

Resultado verificado el 23/09/2026:

- `uv run pytest`: **18 passed**.
- `uv run pytest --cov=auth_service --cov=auth_dependencies --cov=password_reset_service --cov=routes.auth`: **85% total**; cada módulo de autenticación medido supera el 70% (`auth_service` 93%, `auth_dependencies` 80%, `password_reset_service` 81%, `routes.auth` 82%).

## Revisión asistida por IA y bug detectado

La revisión asistida por IA sugirió comprobar especialmente la reutilización de tokens, tokens expirados, emails inexistentes y la política de respuesta genérica del flujo de recuperación. También permitió detectar y corregir un problema real previo: `passlib` era incompatible con la versión moderna de `bcrypt`/Python 3.14 y producía errores de `__about__` y del límite de 72 bytes; la lógica de hash y verificación quedó migrada a la API directa de `bcrypt`.

Otro criterio importante incorporado a la batería es que una contraseña nueva se verifica después de un reset, no solo que el endpoint devuelva un mensaje exitoso.
