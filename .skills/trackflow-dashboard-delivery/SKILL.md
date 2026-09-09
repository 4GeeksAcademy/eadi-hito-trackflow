---
name: qa-pre-delivery-dashboard
description: Validar las UIs de TrackFlow antes de una entrega mediante checks estáticos y smoke tests.
triggers:
  - QA
  - entrega
  - validación
  - antes de deploy
applyTo:
  - uis/backoffice/**
  - uis/website/**
---

# QA Pre-Delivery Dashboard

## Objetivo
Garantizar que el website y el backoffice de TrackFlow estén compilables y respondan correctamente antes de la entrega.

## Inputs
- Rama con los cambios a validar.
- Rutas de las aplicaciones (`uis/website` y `uis/backoffice`).
- Puertos disponibles para los servidores locales.

## Output esperado
Un informe con los comandos ejecutados, resultados de typecheck/lint/build, smoke tests HTTP y cualquier bloqueo encontrado.

## Procedimiento
1. Ejecutar `npm run typecheck` desde la raíz.
2. Ejecutar `npm run lint` y `npm run build` en cada UI.
3. Arrancar cada UI en un puerto disponible.
4. Comprobar HTTP 200 en `/` y verificar una señal visible de cada aplicación.
5. Revisar el diff para detectar secretos, datos personales reales, duplicados y APIs fuera de `services/`.

## Criterios de aceptación
- Typecheck, lint y build terminan con código 0.
- Website devuelve HTTP 200 y contiene su titular corporativo.
- Backoffice devuelve HTTP 200 y contiene un KPI o panel operativo.
- No se detectan secretos ni APIs fuera de `services/`.
- El informe identifica cada comando, ruta validada y resultado.
