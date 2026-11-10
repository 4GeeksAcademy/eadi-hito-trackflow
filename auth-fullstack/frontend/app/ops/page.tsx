'use client';

import Link from 'next/link';
import KpiCard from '../../components/KpiCard';
import LogoutButton from '../../components/LogoutButton';
import LanguageSwitch from '../../components/LanguageSwitch';
import ThemeToggle from '../../components/ThemeToggle';
import { useLocale } from '../../components/LocaleProvider';
import { localizedPath, translate } from '../../lib/i18n';

const carriers = [
  { name: 'SEUR', country: 'España · 1.240 envíos', rate: '96,4%', color: '#0867e9' },
  { name: 'UPS', country: 'Estados Unidos · 980 envíos', rate: '94,1%', color: '#4d94f5' },
  { name: 'MRW', country: 'España · 740 envíos', rate: '91,8%', color: '#7fb4ff' },
  { name: 'FedEx', country: 'Estados Unidos · 620 envíos', rate: '89,7%', color: '#b7d3ff' }
];

export default function BackofficeHome() {
  const locale = useLocale();
  const t = (text: string) => translate(locale, text);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {t('Ir a contenido principal')}
      </a>
      <div className="ops-shell">
        <aside className="sidebar">
          <div className="brand">
            Track<span>Flow</span>
          </div>
          <nav aria-label="Navegación principal">
            <div className="side-label">{t('Operación')}</div>
            <a className="side-link active" href="#resumen">
              <span aria-hidden="true">◈</span> {t('Resumen')}
            </a>
            <Link className="side-link" href={localizedPath('/inventory', locale)}>
              <span aria-hidden="true">▦</span> {t('Inventario')}
            </Link>
            <a className="side-link" href="#envios">
              <span aria-hidden="true">↗</span> {t('Envíos')}
            </a>
            <a className="side-link" href="#transportistas">
              <span aria-hidden="true">◎</span> {t('Transportistas')}
            </a>
            <div className="side-label">{t('Empresa')}</div>
            <a className="side-link" href="#devoluciones">
              <span aria-hidden="true">↩</span> {t('Devoluciones')}
            </a>
            <a className="side-link" href="#alertas">
              <span aria-hidden="true">!</span> {t('Alertas')}
            </a>
            <Link className="side-link" href={localizedPath('/incidents', locale)}>
              <span aria-hidden="true">▤</span> {t('Incidencias')}
            </Link>
            <Link className="side-link" href={localizedPath('/suppliers', locale)}>
              <span aria-hidden="true">◌</span> {t('Proveedores')}
            </Link>
            <div className="side-label">{t('Talento')}</div>
            <Link className="side-link" href={localizedPath('/candidates', locale)}>
              <span aria-hidden="true">◉</span> {t('Candidaturas')}
            </Link>
            <div className="side-label">{t('Enlaces')}</div>
            <Link className="side-link" href={localizedPath('/', locale)}>
              <span aria-hidden="true">⌂</span> {t('Ir a inicio')}
            </Link>
            <LogoutButton />
          </nav>
        </aside>
        <main className="main" id="main-content">
          <header className="topbar">
            <div>
              <div className="eyebrow">
                {t('TrackFlow Ops · Datos de demostración')}
              </div>
              <h1>{t('Buenos días, Evelin.')}</h1>
            </div>
            <div className="topbar-actions">
              <LanguageSwitch />
              <ThemeToggle />
              <div className="date-pill">{locale === 'en' ? 'Updated 4 min ago · Sep 9, 2026' : 'Actualizado hace 4 min · 09 sep 2026'}</div>
            </div>
          </header>
          <section className="kpi-grid" aria-label="Indicadores principales">
            <KpiCard label={t('Pedidos hoy')} value={locale === 'en' ? '2,840' : '2.840'} note={locale === 'en' ? '↑ 12.8% vs. yesterday' : '↑ 12,8% vs. ayer'} />
            <KpiCard label={t('Entregas a tiempo')} value="94,6%" note={locale === 'en' ? '↑ 1.2 pts this week' : '↑ 1,2 pts esta semana'} />
            <KpiCard label={t('Stock bajo')} value={<>18 <small>{t('SKUs')}</small></>} note={t('5 requieren atención')} noteVariant="alert" />
            <KpiCard label={t('Devoluciones')} value="21,3%" note={t('Dentro del rango 18–25%')} noteVariant="info" />
          </section>
          <div className="content-grid">
            <section className="panel" id="inventario">
              <div className="panel-heading">
                <h2>{t('Inventario')}</h2>
                <Link className="inventory-open-link" href={localizedPath('/inventory', locale)}>{t('Ver datos reales →')}</Link>
              </div>
              <div className="inventory-promo">
                <span aria-hidden="true">▦</span>
                <div>
                  <strong>{t('Consulta el stock y los movimientos registrados.')}</strong>
                  <p>{t('El detalle de productos y entradas y salidas está conectado al inventario operativo.')}</p>
                </div>
                <Link className="primary-button" href={localizedPath('/inventory', locale)}>{t('Abrir inventario')}</Link>
              </div>
            </section>
            <section className="panel" id="transportistas">
              <div className="panel-heading">
                <h2>{t('Rendimiento de transportistas')}</h2>
                <span>{t('Esta semana')}</span>
              </div>
              <div className="carrier-list">
                {carriers.map((carrier) => (
                  <div className="carrier-row" key={carrier.name}>
                    <div>
                      <span
                        className="carrier-name"
                        style={{
                          borderLeft: `3px solid ${carrier.color}`,
                          paddingLeft: 9,
                        }}
                      >
                        {carrier.name}
                      </span>
                      <span className="carrier-meta">{t(carrier.country)}</span>
                    </div>
                    <span className="rate">{carrier.rate}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="alert-panel" id="alertas">
            <strong>{t('5 alertas de stock requieren revisión')}</strong>
            <p>
              {locale === 'en' ? 'The Vitamin C Serum and four other SKUs are below the threshold set in Zaragoza. Review replenishment before the next cutoff.' : 'El Sérum Vitamina C y cuatro SKUs más están por debajo del umbral configurado en Zaragoza. Revisa la reposición antes del próximo corte.'}
            </p>
          </div>
        </main>
      </div>
    </>
  );
}