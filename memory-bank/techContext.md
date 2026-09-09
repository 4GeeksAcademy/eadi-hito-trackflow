# Technical Context — TrackFlow

## Estructura
- `src/`: modelos y utilidades TypeScript de dominio compartidas en la raíz.
- `uis/website/`: aplicación Next.js pública y orientada a captación B2B.
- `uis/backoffice/`: aplicación Next.js interna con su propio layout y dashboard inicial.
- `services/`: espacio reservado para futuros servicios backend; no se crean APIs dentro de las UIs nuevas.
- `memory-bank/`: contexto persistente de negocio, técnica y progreso.
- `.agents/`: reglas y skills reutilizables para agentes.

## Stack adoptado
Las UIs usan Next.js 16, React 19, TypeScript y CSS global local a cada aplicación. Se mantiene el patrón App Router y cada aplicación tiene `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx` y `app/globals.css` propios.

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
