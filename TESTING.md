# Plan y ejecución de pruebas

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
