# Auditoría de rendimiento

Fecha: 2026-10-15  
Herramienta: Lighthouse 13.5.0, Chrome for Testing 151.0.7922.34.  
Entorno medido: Next.js 16.3.4 sirviendo `http://localhost:3000` en modo desarrollo. La ruta `/` es el sitio público y `/ops` es el dashboard; ambos pertenecen a `auth-fullstack/frontend`. No se midieron `index.html`/`application.html`, que son copias estáticas independientes y no las sirve la aplicación activa de 3000.

Las cuatro categorías de Lighthouse se registraron para ambas URLs en desktop y mobile. Las puntuaciones son sobre 100. Los tiempos son ms y corresponden a la misma configuración Lighthouse antes/después.

## Medición inicial

| Página | Modo | Performance | Accessibility | Best Practices | SEO | TTFB | FCP | LCP | TBT | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` sitio público | Desktop | 96 | 96 | 96 | 100 | 122 | 797 | 797 | 135 | 0.006 |
| `/` sitio público | Mobile | 62 | 96 | 96 | 100 | 646 | 2,685 | 2,835 | 2,159 | 0.051 |
| `/ops` dashboard | Desktop | 99 | 95 | 96 | 100 | 209 | 752 | 792 | 44 | 0.012 |
| `/ops` dashboard | Mobile | 80 | 95 | 96 | 100 | 49 | 2,668 | 2,968 | 416 | 0.018 |

Informes, JSON y capturas: [`audit/before/`](audit/before/). Cada página/modo tiene `*.report.html`, `*.report.json` y una captura PNG con el score visible.

## Problemas y causas

1. **Fuentes bloqueantes en ambas rutas.** `app/globals.css` importaba DM Sans y Space Grotesk desde Google Fonts con `@import`. Lighthouse señaló esa hoja externa entre los recursos que bloquean el render y estimó 1.7–1.9 s de ahorro. La dependencia de red retrasaba FCP/LCP y contribuía a CLS durante el intercambio de fuente.
2. **Hidratación innecesaria en `/ops`.** El dashboard solo presenta enlaces y datos estáticos, pero declaraba `'use client'`. Eso enviaba código cliente e hidrataba una vista que no requiere estado ni eventos React.
3. **KPI repetidos.** El dashboard y `/inventory/products` duplicaban la misma estructura de tarjeta (etiqueta, valor y nota). La duplicación hacía que cambios de estilo/semántica tuvieran que mantenerse por separado.
4. **Contraste de texto insuficiente.** En el baseline fallaban 19 elementos de `/` mobile y hasta 22 de `/ops` desktop. Causa: `--muted`, `--coral`, `--green`, texto de tarjetas y rótulos laterales no alcanzaban 4.5:1 para texto normal o 3:1 para texto grande.
5. **Favicon ausente.** Ambas rutas pedían `/favicon.ico` y recibían 404; Lighthouse registró el error de red en consola y redujo Best Practices.
6. **Límites del modo desarrollo.** Los informes marcaban source maps ausentes en chunks internos de Turbopack/Next dev y unos 320 KiB de JavaScript dev sin usar, incluido `next-devtools`. No se ocultaron ni modificaron esos diagnósticos: no son código de la app de producción. TBT también varió fuertemente entre corridas del servidor de desarrollo, por lo que no se atribuye toda esa variación a las correcciones.

## Análisis de reutilización

- **Tarjetas KPI en dashboard e inventario:** `/ops` y `app/inventory/products/page.tsx` repetían el mismo bloque de datos. Es un buen componente por compartir estructura y variaciones pequeñas (nota de alerta/info). Se extrajo `KpiCard` y se integró en ambas rutas; recibe etiqueta, valor, nota y variante semántica.
- **Avisos de estado en flujos públicos y operativos:** la portada maneja error/éxito del formulario; proveedores e incidencias repiten avisos, roles ARIA y acciones de reintento. Un `FeedbackNotice` compartido podría normalizar accesibilidad y estilos. Se deja como candidato: tiene variaciones de interacción y no era necesario para resolver los problemas principales de esta auditoría.
- **Navegación de la landing y el panel:** ambas vistas tienen navegación propia y distinta densidad; compartir solo enlaces comunes requeriría una abstracción que no elimina suficiente complejidad. Se mantuvieron separadas para evitar una refactorización estructural.

No se instalaron skills externas: Lighthouse, el análisis del navegador y las guías locales de Next.js bastaron para identificar y verificar estas causas. No se modificó la arquitectura de las aplicaciones.

## Archivos de evidencia

- Antes: [`audit/before/`](audit/before/)
- Después: [`audit/after/`](audit/after/)
- Comparativa y valoración: [`REPORT.md`](REPORT.md)
