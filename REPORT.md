# Informe Lighthouse

Fecha: 2026-10-15  
Sitio público: `http://localhost:3000/`  
Dashboard: `http://localhost:3000/ops`  
Herramienta: Lighthouse 13.5.0, Chrome for Testing 151.0.7922.34.

## Comparativa de puntuaciones

| Superficie | Modo | Performance | Accessibility | Best Practices | SEO |
| --- | --- | ---: | ---: | ---: | ---: |
| Sitio público `/` | Desktop | 96 → 96 | 96 → 100 | 96 → 100 | 100 → 100 |
| Sitio público `/` | Mobile | 62 → 78 | 96 → 100 | 96 → 100 | 100 → 100 |
| Dashboard `/ops` | Desktop | 99 → 87 | 95 → 100 | 96 → 100 | 100 → 100 |
| Dashboard `/ops` | Mobile | 80 → 73 | 95 → 100 | 96 → 100 | 100 → 100 |

## Métricas prioritarias

| Superficie | Modo | TTFB ms | FCP ms | LCP ms | TBT ms | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| `/` | Desktop antes | 122 | 797 | 797 | 135 | 0.0062 |
| `/` | Desktop después | 308 | 470 | 655 | 166 | 0 |
| `/` | Mobile antes | 646 | 2,685 | 2,835 | 2,159 | 0.0514 |
| `/` | Mobile después | 58 | 1,255 | 2,501 | 791 | 0 |
| `/ops` | Desktop antes | 209 | 752 | 792 | 44 | 0.0116 |
| `/ops` | Desktop después | 230 | 324 | 605 | 304 | 0 |
| `/ops` | Mobile antes | 49 | 2,668 | 2,968 | 416 | 0.0184 |
| `/ops` | Mobile después | 84 | 1,190 | 2,315 | 1,418 | 0 |

Los scores y métricas se calcularon de nuevo sobre los JSON conservados en `audit/before/` y `audit/after/`. Las capturas PNG de ambos ciclos muestran los cuatro informes.

## Correcciones aplicadas

- **Fuentes:** sustituí el `@import` externo de Google Fonts por `next/font/google` para DM Sans y Space Grotesk. Next las sirve desde el mismo origen; Lighthouse dejó de marcar Google Fonts como recurso bloqueante. El mayor impacto estable se ve en FCP/LCP y CLS: en home mobile FCP bajó 1,430 ms, LCP 334 ms y CLS pasó de 0.0514 a 0.
- **Hidratación:** eliminé `'use client'` de `/ops`, una vista estática que solo usa enlaces. La página se puede renderizar como Server Component sin cambiar su interacción.
- **Componente compartido:** extraje `KpiCard` y lo integré en `/ops` y `/inventory/products`, reemplazando el markup duplicado.
- **Contraste:** oscurecí los tokens de texto `--muted`, `--coral`, `--green`, el texto de tarjetas y los rótulos laterales según los pares que fallaban. Lighthouse pasó de 19–22 elementos afectados a cero y Accessibility llegó a 100 en las cuatro mediciones.
- **Icono:** añadí `app/icon.svg` con la convención de Next. La petición que devolvía 404 desapareció; Best Practices pasó de 96 a 100 y no hay errores de consola en los informes finales.

## Impacto y límites

El cambio de fuentes tuvo el efecto más claro sobre el render: eliminó la petición externa bloqueante, aceleró FCP en las dos superficies y redujo LCP en ambas. El KPI compartido mejora mantenibilidad; no se le atribuye un ahorro de tiempo no medido. La frontera de cliente retirada en `/ops` reduce hidratación, aunque Lighthouse no aísla su impacto debido al servidor de desarrollo.

La app se midió en `next dev`, no en `next start`/producción. El baseline incluye chunks `next-devtools` y source maps internos ausentes. El TBT y, por tanto, Performance variaron mucho entre corridas: aunque FCP/LCP/CLS mejoran en ambas rutas, el score Performance de `/ops` baja en esta captura final. No se presenta como mejora; para comparar TBT de producción hace falta desplegar o ejecutar la build optimizada en el mismo entorno y repetir Lighthouse allí.

No instalé skills externas: no fueron necesarias para aplicar las correcciones. La guía local de Next.js confirmó `next/font`, la convención de icono y el cambio de Server Component.

## Validación

- `npm run build`: correcto; Next compiló y completó TypeScript y rutas.
- `npm run lint`: correcto.
- Lighthouse final: cuatro informes (dos páginas por dos modos), sin fallos de contraste ni errores de consola.
- No se reestructuraron los frontends.

## Evidencia

- Informes y capturas antes: `audit/before/`.
- Informes y capturas después: `audit/after/`.
- Causas y análisis de reutilización: [`AUDIT.md`](AUDIT.md).
