# Technical Context — TrackFlow

## Estructura
- `src/`: modelos y utilidades TypeScript de dominio compartidas en la raíz.
- `uis/website/`: aplicación Next.js pública y orientada a captación B2B.
- `uis/talent-pipeline-tracker/`: aplicación Next.js para pipeline de talento.
- `backend/`: API FastAPI (Python) — auth, usuarios, perfiles, proveedores, recuperación de contraseña.
- `frontend/`: aplicación Next.js (TypeScript) — backoffice con KPIs, inventario, carriers, devoluciones.
- `auth/`: tipos y modelos compartidos (Python + TypeScript).
- `services/`: espacio reservado para futuros servicios backend; actualmente contiene `services/api/` (obsoleto).
- `memory-bank/`: contexto persistente de negocio, técnica y progreso.
- `.agents/`: reglas y skills reutilizables para agentes.

## Stack adoptado
Las UIs usan Next.js 16, React 19, TypeScript y CSS global local a cada aplicación. Se mantiene el patrón App Router y cada aplicación tiene `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx` y `app/globals.css` propios.

## Backend
- FastAPI 0.141.1, Python 3.14
- TinyDB 4.9.0 (base de datos embebida)
- JWT (python-jose 3.5.0) para autenticación stateless
- Passlib 1.7.4 + bcrypt 3.2.2 para hashing de contraseñas
- Resend 2.46.0 para envío de emails
- Uvicorn 0.53.0 como servidor ASGI
- Entorno virtual en `backend/.venv/`

## Decisiones
- El idioma base de la experiencia es español, por el equipo técnico de Zaragoza y el briefing del hito.
- La web pública prioriza accesibilidad, SEO básico y captación de leads de empresas, no tracking de consumidores.
- El backoffice muestra datos de ejemplo derivados del dominio TrackFlow para que la vista sea visible desde el primer día.
- El dominio existente en `src/` se conserva y no se duplica dentro de las UIs.
- Las integraciones reales, persistencia y APIs futuras deben vivir bajo `services/`.

## Restricciones
- No modificar `uis/talent-pipeline-tracker/`, `src/`, `CONTEXT*.md` ni `recursos/` sin confirmación explícita.
- No añadir dependencias innecesarias ni mezclar layouts entre aplicaciones.
- Todo cambio debe poder validarse con typecheck, lint o build del alcance afectado.
