'use client';

import Link from 'next/link';

const carriers = [
  { name: 'SEUR', country: 'España · 1.240 envíos', rate: '96,4%', color: '#2f8b6a' },
  { name: 'UPS', country: 'Estados Unidos · 980 envíos', rate: '94,1%', color: '#ef795f' },
  { name: 'MRW', country: 'España · 740 envíos', rate: '91,8%', color: '#7d8ee8' },
  { name: 'FedEx', country: 'Estados Unidos · 620 envíos', rate: '89,7%', color: '#d09d3e' }
];

export default function BackofficeHome() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Ir al contenido principal
      </a>
      <div className="ops-shell">
        <aside className="sidebar">
          <div className="brand">
            Track<span>Flow</span>
          </div>
          <nav aria-label="Navegación principal">
            <div className="side-label">Operación</div>
            <a className="side-link active" href="#resumen">
              <span aria-hidden="true">◈</span> Resumen
            </a>
            <Link className="side-link" href="/inventory">
              <span aria-hidden="true">▦</span> Inventario
            </Link>
            <a className="side-link" href="#envios">
              <span aria-hidden="true">↗</span> Envíos
            </a>
            <a className="side-link" href="#transportistas">
              <span aria-hidden="true">◎</span> Transportistas
            </a>
            <div className="side-label">Empresa</div>
            <a className="side-link" href="#devoluciones">
              <span aria-hidden="true">↩</span> Devoluciones
            </a>
            <a className="side-link" href="#alertas">
              <span aria-hidden="true">!</span> Alertas
            </a>
            <Link className="side-link" href="/incidents">
              <span aria-hidden="true">▤</span> Incidencias
            </Link>
            <Link className="side-link" href="/suppliers">
              <span aria-hidden="true">◌</span> Proveedores
            </Link>
            <div className="side-label">Talento</div>
            <Link className="side-link" href="/candidates">
              <span aria-hidden="true">◉</span> Candidaturas
            </Link>
            <div className="side-label">Enlaces</div>
            <Link className="side-link" href="/">
              <span aria-hidden="true">⌂</span> Ir a inicio
            </Link>
            <Link className="side-link" href="/login">
              <span aria-hidden="true">⊚</span> Acceder
            </Link>
          </nav>
        </aside>
        <main className="main" id="main-content">
          <header className="topbar">
            <div>
              <div className="eyebrow">
                TrackFlow Ops · Datos de demostración
              </div>
              <h1>Buenos días, Ana.</h1>
            </div>
            <div className="date-pill">
              Actualizado hace 4 min · 09 sep 2026
            </div>
          </header>
          <section className="kpi-grid" aria-label="Indicadores principales">
            <div className="kpi">
              <div className="kpi-label">Pedidos hoy</div>
              <div className="kpi-value">2.840</div>
              <div className="kpi-note">↑ 12,8% vs. ayer</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Entregas a tiempo</div>
              <div className="kpi-value">94,6%</div>
              <div className="kpi-note">↑ 1,2 pts esta semana</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Stock bajo</div>
              <div className="kpi-value">
                18 <small>SKUs</small>
              </div>
              <div className="kpi-note alert">5 requieren atención</div>
            </div>
            <div className="kpi">
              <div className="kpi-label">Devoluciones</div>
              <div className="kpi-value">21,3%</div>
              <div className="kpi-note info">Dentro del rango 18–25%</div>
            </div>
          </section>
          <div className="content-grid">
            <section className="panel" id="inventario">
              <div className="panel-heading">
                <h2>Inventario</h2>
                <Link className="inventory-open-link" href="/inventory">Ver datos reales →</Link>
              </div>
              <div className="inventory-promo">
                <span aria-hidden="true">▦</span>
                <div>
                  <strong>Consulta el stock y los movimientos registrados.</strong>
                  <p>El detalle de productos y entradas y salidas está conectado al inventario operativo.</p>
                </div>
                <Link className="primary-button" href="/inventory">Abrir inventario</Link>
              </div>
            </section>
            <section className="panel" id="transportistas">
              <div className="panel-heading">
                <h2>Rendimiento de carriers</h2>
                <span>Esta semana</span>
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
                      <span className="carrier-meta">{carrier.country}</span>
                    </div>
                    <span className="rate">{carrier.rate}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <div className="alert-panel" id="alertas">
            <strong>5 alertas de stock requieren revisión</strong>
            <p>
              El Sérum Vitamina C y cuatro SKUs más están por debajo del umbral
              configurado en Zaragoza. Revisa la reposición antes del próximo
              corte.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}