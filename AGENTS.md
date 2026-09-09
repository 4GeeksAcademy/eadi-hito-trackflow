# AGENTS.md — TrackFlow

## Inicio de sesión
Antes de inspeccionar o modificar código, el agente debe leer, en este orden:
1. `memory-bank/projectbrief.md` para entender el negocio y sus usuarios.
2. `memory-bank/techContext.md` para conocer estructura, stack y restricciones.
3. `memory-bank/progress.md` para conocer el estado actual y los siguientes pasos.
4. El `AGENTS.md` o `CLAUDE.md` más cercano a la carpeta que vaya a modificar.
5. La regla aplicable dentro de `.agents/rules/` y la skill relevante dentro de `.agents/skills/`, si la tarea las activa.

## Flujo obligatorio antes de cada commit
1. Revisar el diff y confirmar que los cambios pertenecen al objetivo solicitado.
2. Ejecutar la validación más estrecha disponible: typecheck, lint, tests o build del paquete afectado.
3. Verificar que no se han introducido secretos, datos personales reales, duplicados de carpetas ni APIs fuera de `services/`.
4. Actualizar `memory-bank/progress.md` si cambia el estado del proyecto o quedan próximos pasos nuevos.
5. Explicar el resultado de las validaciones y solo entonces preparar el commit; el agente no debe hacer commit automáticamente sin confirmación del desarrollador.

## Zonas protegidas
Sin confirmación explícita del desarrollador, el agente no debe modificar:
- `CONTEXT.md`, `CONTEXT_2.md`, `CONTEXT_3.md` ni `recursos/`.
- `src/` y sus modelos/utilidades existentes.
- `uis/talent-pipeline-tracker/`.
- `.env*`, credenciales, secretos o configuración de despliegue compartida.
- Historial Git, ramas o commits existentes.

Las nuevas aplicaciones deben vivir en `uis/website/` y `uis/backoffice/`. Los servicios backend deben vivir en `services/`.
