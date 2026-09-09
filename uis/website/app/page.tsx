'use client';

import { FormEvent, useState } from 'react';

const services = [
  { number: '01', title: 'Gestión de almacenes', copy: 'Inventario visible y operaciones coordinadas desde Los Ángeles y Zaragoza.', items: ['Almacenamiento, picking y packing', 'Inventario en tiempo real', 'Alertas de stock bajo'] },
  { number: '02', title: 'Última milla', copy: 'La red de transportistas y el seguimiento que convierten la promesa en entrega.', items: ['Red de 8 carriers', 'Tracking unificado', 'Gestión de incidencias'] },
  { number: '03', title: 'Logística inversa', copy: 'Devoluciones más rápidas, consistentes y conectadas con tu plataforma.', items: ['Aprobación y recogida', 'Inspección y reacondicionamiento', 'Análisis de patrones'] }
];

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [comments, setComments] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const company = String(form.get('company') || '').trim();
    const contact = String(form.get('contact') || '').trim();
    const email = String(form.get('email') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const website = String(form.get('website') || '').trim();
    const servicesSelected = form.getAll('services');
    const privacy = form.get('privacy');
    if (company.length < 2) return setError('El nombre de la empresa debe tener al menos 2 caracteres');
    if (contact.split(/\\s+/).length < 2) return setError('Ingresa nombre y apellido del contacto');
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return setError('Ingresa un email corporativo válido');
    if (!/^\\+\\d[\\d ]{6,}$/.test(phone)) return setError('El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)');
    if (website && !/^https?:\/\/[^\\s]+$/.test(website)) return setError('Si incluyes sitio web, debe ser una URL válida');
    if (!form.get('country')) return setError('Selecciona el país de operación principal');
    if (!form.get('product')) return setError('Selecciona el tipo de producto que manejas');
    if (!form.get('volume')) return setError('Selecciona el volumen mensual estimado');
    if (!servicesSelected.length) return setError('Selecciona al menos un servicio de interés');
    if (!privacy) return setError('Debes aceptar la política de privacidad para continuar');
    setError('');
    setSubmitted(true);
  }

  return <main className="page-shell">
    <header className="container" style={{ paddingTop: 26 }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }} aria-label="Navegación principal">
        <a href="#inicio" style={{ fontFamily: 'Space Grotesk', fontSize: '1.45rem', fontWeight: 700 }}>Track<span style={{ color: 'var(--coral)' }}>Flow</span></a>
        <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}><a className="nav-link" href="#servicios">Servicios</a><a className="nav-link" href="#cobertura">Cobertura</a><a className="button button-primary" href="#contacto">Solicitar información</a></div>
      </nav>
    </header>
    <section className="container hero-grid" id="inicio">
      <div><div className="eyebrow">TrackFlow Tech · desde 2009</div><h1 className="hero-title">Logística que escala con tu e-commerce.</h1><p className="hero-copy">Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España. Tú haces crecer la marca; nosotros movemos lo que la hace posible.</p><a className="button button-light" href="#contacto" style={{ marginTop: 28 }}>Hablemos de tu operación <span aria-hidden="true" style={{ marginLeft: 12 }}>↗</span></a></div>
      <div className="hero-art" aria-label="Mapa de la operación binacional de TrackFlow"><div className="route-map"><div className="map-label la"><span>Almacén</span>Los Ángeles</div><div className="map-label zg"><span>Almacén</span>Zaragoza</div><div className="map-stat">+130 profesionales · 2 mercados</div></div></div>
    </section>
    <section className="section container" id="servicios"><div className="section-heading"><div><div className="eyebrow">Una operación, una visión</div><h2>Todo lo que pasa después del click.</h2></div><p>Conectamos inventario, personas y transportistas para que cada pedido avance con menos fricción.</p></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.number}><div className="service-number">{service.number}</div><h3>{service.title}</h3><p>{service.copy}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>
    <section className="section coverage-band" id="cobertura"><div className="container"><div className="section-heading"><div><div className="eyebrow" style={{ color: 'var(--lime)' }}>Dos países. Una operación.</div><h2>Visibilidad donde tu cliente la necesita.</h2></div><p style={{ color: '#bfd0c6' }}>Una infraestructura binacional preparada para crecer con tus mercados.</p></div><div className="coverage-grid"><article className="coverage-card"><h3>Estados Unidos</h3><p>Almacén en Los Ángeles<br />Cobertura nacional<br />UPS · FedEx · DHL</p></article><article className="coverage-card"><h3>España</h3><p>Almacén en Zaragoza<br />Cobertura peninsular e islas<br />MRW · SEUR · DHL</p></article></div></div></section>
    <section className="section container"><div className="eyebrow">Por qué TrackFlow</div><div className="benefit-grid" style={{ marginTop: 32 }}><div className="benefit"><strong>Operación binacional</strong><span>Infraestructura propia en Estados Unidos y España.</span></div><div className="benefit"><strong>+130 profesionales</strong><span>Equipos que conocen tu operación de principio a fin.</span></div><div className="benefit"><strong>Tecnología propia</strong><span>Datos de inventario y entregas en una sola mirada.</span></div><div className="benefit"><strong>E-commerce nativo</strong><span>Moda, electrónica y cosmética son nuestro terreno.</span></div></div></section>
    <section className="section container" id="contacto"><div className="contact-panel"><div><div className="eyebrow">Hablemos</div><h2 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', lineHeight: 1, margin: '14px 0 20px' }}>Tu próxima entrega empieza aquí.</h2><p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Cuéntanos cómo funciona hoy tu logística y te mostraremos dónde puede llegar mañana.</p><p style={{ marginTop: 34, lineHeight: 1.8, fontSize: '.9rem' }}>comercial@trackflow.com<br />Los Ángeles: +1 213 555 0147<br />Zaragoza: +34 976 123 456</p></div>{submitted ? <div className="success"><strong>¡Gracias por tu interés en TrackFlow!</strong><p>Hemos recibido tu solicitud. Nuestro equipo comercial te contactará en las próximas 24-48 horas.</p><p>comercial@trackflow.com</p></div> : <form onSubmit={handleSubmit} noValidate><div className="form-grid"><div className="field"><label htmlFor="company">Empresa *</label><input id="company" name="company" required /></div><div className="field"><label htmlFor="contact">Persona de contacto *</label><input id="contact" name="contact" required /></div><div className="field"><label htmlFor="email">Email corporativo *</label><input id="email" name="email" type="email" required /></div><div className="field"><label htmlFor="phone">Teléfono *</label><input id="phone" name="phone" placeholder="+34 600 000 000" required /></div><div className="field"><label htmlFor="country">País de operación *</label><select id="country" name="country" defaultValue=""><option value="">Selecciona una opción</option><option>Estados Unidos</option><option>España</option><option>Ambos</option><option>Otro</option></select></div><div className="field"><label htmlFor="product">Tipo de producto *</label><select id="product" name="product" defaultValue=""><option value="">Selecciona una opción</option><option>Moda</option><option>Electrónica</option><option>Cosmética</option><option>Alimentación</option><option>Otro</option></select></div><div className="field"><label htmlFor="volume">Envíos mensuales *</label><select id="volume" name="volume" defaultValue=""><option value="">Selecciona una opción</option><option>0-100</option><option>101-500</option><option>501-2000</option><option>2000+</option><option>No estoy seguro</option></select></div><div className="field"><label htmlFor="website">Sitio web</label><input id="website" name="website" type="url" placeholder="https://" /></div><div className="field full"><span style={{ fontSize: '.8rem', fontWeight: 700 }}>Servicios de interés *</span><div className="checks">{['Almacenaje', 'Última milla', 'Logística inversa'].map((service) => <label className="check" key={service}><input type="checkbox" name="services" value={service} />{service}</label>)}</div></div><div className="field full"><label htmlFor="comments">Cuéntanos más</label><textarea id="comments" name="comments" maxLength={500} value={comments} onChange={(event) => setComments(event.target.value)} /><small style={{ color: 'var(--muted)' }}>{comments.length}/500 caracteres</small></div><div className="field full"><label className="check"><input type="checkbox" name="privacy" required /> Acepto la política de privacidad *</label></div></div>{error && <p className="form-message error" role="alert">{error}</p>}<button className="button button-primary" type="submit" style={{ marginTop: 20 }}>Solicitar información ↗</button></form>}</div></section>
    <footer className="site-footer"><div className="container footer-row"><span>© 2025 TrackFlow. Todos los derechos reservados.</span><span>LinkedIn · Los Ángeles · Zaragoza</span></div></footer>
  </main>;
}
