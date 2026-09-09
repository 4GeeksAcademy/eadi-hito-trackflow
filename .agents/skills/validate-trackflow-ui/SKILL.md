# Skill: Validate TrackFlow UI

## Objetivo
Validar de forma repetible una aplicación frontend de TrackFlow antes de entregarla.

## Inputs
- `APP_DIR`: ruta de la aplicación, por ejemplo `uis/website` o `uis/backoffice`.
- `CHECK`: comando opcional de validación adicional, si el equipo lo requiere.

## Procedimiento
1. Entrar en `APP_DIR`.
2. Ejecutar `npm run build`.
3. Si existe `npm run lint`, ejecutarlo.
4. Ejecutar `CHECK` cuando se proporcione.
5. Reportar el resultado de cada comando y cualquier bloqueo.

## Criterios de aceptación
- La carpeta indicada existe y contiene `package.json`.
- `npm run build` termina con código 0.
- `npm run lint`, si está definido, termina con código 0.
- No quedan errores TypeScript, de compilación ni de lint en la salida.
- El informe identifica la aplicación validada y cada comando ejecutado.
