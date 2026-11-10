'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ThemeToggle from '../components/ThemeToggle';

const services = [
  { number: '01', title: 'Gestión de almacenes', copy: 'Inventario visible y operaciones coordinadas desde Los Ángeles y Zaragoza.', items: ['Almacenamiento, picking y packing', 'Inventario en tiempo real', 'Alertas de stock bajo'] },
  { number: '02', title: 'Última milla', copy: 'La red de transportistas y el seguimiento que convierten la promesa en entrega.', items: ['Red de 8 carriers', 'Tracking unificado', 'Gestión de incidencias'] },
  { number: '03', title: 'Logística inversa', copy: 'Devoluciones más rápidas, consistentes y conectadas con tu plataforma.', items: ['Aprobación y recogida', 'Inspección y reacondicionamiento', 'Análisis de patrones'] }
];

export default function HomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    function updateVisibility() {
      setShowBackToTop(window.scrollY > 240);
    }
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  function scrollToTop() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  }

  function getFieldError(form: FormData, name: string) {
    const value = String(form.get(name) || '').trim();
    if (name === 'company' && value.length < 2) return 'El nombre de la empresa debe tener al menos 2 caracteres';
    if (name === 'contact' && value.split(/\s+/).filter(Boolean).length < 2) return 'Ingresa nombre y apellido del contacto';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ingresa un email corporativo válido';
    if (name === 'phone' && !/^\+\d[\d ]{6,}$/.test(value)) return 'El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)';
    if (name === 'website' && value && !/^https?:\/\/[^\s]+$/.test(value)) return 'Si incluyes sitio web, debe ser una URL válida';
    if (['country', 'product', 'volume'].includes(name) && !value) return 'Completa este campo';
    if (name === 'services' && !form.getAll('services').length) return 'Selecciona al menos un servicio de interés';
    if (name === 'privacy' && !form.get('privacy')) return 'Debes aceptar la política de privacidad para continuar';
    return '';
  }

  function validateField(formElement: HTMLFormElement, name: string) {
    const message = getFieldError(new FormData(formElement), name);
    setErrors((current) => ({ ...current, [name]: message }));
    return !message;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const fieldNames = ['company', 'contact', 'email', 'phone', 'website', 'country', 'product', 'volume', 'services', 'privacy'];
    const nextErrors = Object.fromEntries(fieldNames.map((name) => [name, getFieldError(form, name)]));
    setErrors(nextErrors);
    const firstInvalid = fieldNames.find((name) => nextErrors[name]);
    if (firstInvalid) {
      formElement.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setSubmitted(true);
  }

  return <main className="page-shell">
    {showBackToTop && <button className="back-to-top" type="button" onClick={scrollToTop} aria-label="Volver al inicio de la página" title="Volver al inicio"><span aria-hidden="true">&#8593;</span></button>}
    <header className="site-header">
      <nav className="container site-nav" aria-label="Navegación principal">
        <a href="#inicio" className="brand-lockup" aria-label="TrackFlow, inicio"><Image src="/trackflow-logo.png" alt="" width={40} height={36} className="brand-mark brand-mark-light" /><Image src="/trackflow-logo.png" alt="" width={40} height={36} className="brand-mark brand-mark-dark" /><span className="brand-wordmark">Track<span>Flow</span></span></a>
        <div className="site-nav-links"><a className="nav-link" href="#servicios">Servicios</a><a className="nav-link" href="#cobertura">Cobertura</a><Link className="nav-link" href="/login">Acceder</Link><ThemeToggle /><a className="button button-primary" href="#contacto">Solicitar información</a></div>
      </nav>
    </header>
    <section className="container hero-grid" id="inicio">
      <div><div className="eyebrow">TrackFlow Tech · desde 2009</div><h1 className="hero-title">Logística que escala con tu e-commerce.</h1><p className="hero-copy">Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España. Tú haces crecer la marca; nosotros movemos lo que la hace posible.</p><a className="button button-light" href="#contacto" style={{ marginTop: 28 }}>Hablemos de tu operación <span aria-hidden="true" style={{ marginLeft: 12 }}>↗</span></a></div>
      <div className="hero-art"><Image src="/landingpage.jpg" alt="Centro de distribución de TrackFlow con camiones de reparto" fill sizes="(max-width: 800px) 100vw, 45vw" className="hero-photo" priority /></div>
    </section>
    <section className="section container" id="servicios"><div className="section-heading"><div><div className="eyebrow">Una operación, una visión</div><h2>Todo lo que pasa después del click.</h2></div><p>Conectamos inventario, personas y transportistas para que cada pedido avance con menos fricción.</p></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.number}><div className="service-number">{service.number}</div><h3>{service.title}</h3><p>{service.copy}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>
    <section className="section coverage-band" id="cobertura"><div className="container"><div className="section-heading"><div><div className="eyebrow" style={{ color: 'var(--lime)' }}>Dos países. Una operación.</div><h2>Visibilidad donde tu cliente la necesita.</h2></div><p style={{ color: '#bfd0c6' }}>Una infraestructura binacional preparada para crecer con tus mercados.</p></div><div className="coverage-grid"><article className="coverage-card"><Image src="/coverage-us.png" alt="" fill sizes="(max-width: 560px) 100vw, 50vw" className="coverage-image" /><h3>Estados Unidos</h3><p>Almacén en Los Ángeles<br />Cobertura nacional<br />UPS · FedEx · DHL</p></article><article className="coverage-card"><Image src="/coverage-spain.png" alt="" fill sizes="(max-width: 560px) 100vw, 50vw" className="coverage-image" /><h3>España</h3><p>Almacén en Zaragoza<br />Cobertura peninsular e islas<br />MRW · SEUR · DHL</p></article></div></div></section>
    <section className="section container"><div className="eyebrow">Por qué TrackFlow</div><div className="benefit-grid" style={{ marginTop: 32 }}><div className="benefit"><strong>Operación binacional</strong><span>Infraestructura propia en Estados Unidos y España.</span></div><div className="benefit"><strong>+130 profesionales</strong><span>Equipos que conocen tu operación de principio a fin.</span></div><div className="benefit"><strong>Tecnología propia</strong><span>Datos de inventario y entregas en una sola mirada.</span></div><div className="benefit"><strong>E-commerce nativo</strong><span>Moda, electrónica y cosmética son nuestro terreno.</span></div></div></section>
    <section className="section container" id="contacto">
      <div className="contact-panel">
        <div>
          <div className="eyebrow">Hablemos</div>
          <h2 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', lineHeight: 1, margin: '14px 0 20px' }}>Tu próxima entrega empieza aquí.</h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Cuéntanos cómo funciona hoy tu logística y te mostraremos dónde puede llegar mañana.</p>
          <p style={{ marginTop: 34, lineHeight: 1.8, fontSize: '.9rem' }}>
            <a href="mailto:comercial@trackflow.com">comercial@trackflow.com</a><br />
            <a href="tel:+12135550147">Los Ángeles: +1 213 555 0147</a><br />
            <a href="tel:+34976123456">Zaragoza: +34 976 123 456</a>
          </p>
        </div>
        {submitted ? <div className="success"><strong>¡Gracias por tu interés en TrackFlow!</strong><p>Hemos recibido tu solicitud. Nuestro equipo comercial te contactará en las próximas 24-48 horas.</p><p><a href="mailto:comercial@trackflow.com">comercial@trackflow.com</a></p><button className="button button-primary" type="button" onClick={() => { setErrors({}); setSubmitted(false); }} style={{ marginTop: 16 }}>Enviar otro formulario</button></div> : <form onSubmit={handleSubmit} noValidate onBlur={(event) => {
          const target = event.target;
          if ((target instanceof HTMLInputElement || target instanceof HTMLSelectElement) && target.name) validateField(event.currentTarget, target.name);
        }} onChange={(event) => {
          const target = event.target;
          if ((target instanceof HTMLInputElement || target instanceof HTMLSelectElement) && errors[target.name]) validateField(event.currentTarget, target.name);
        }}>
          <div className="form-grid">
            <div className="field"><label htmlFor="company">Empresa *</label><input id="company" name="company" required aria-invalid={Boolean(errors.company)} />{errors.company && <span className="form-message error">{errors.company}</span>}</div>
            <div className="field"><label htmlFor="contact">Persona de contacto *</label><input id="contact" name="contact" required aria-invalid={Boolean(errors.contact)} />{errors.contact && <span className="form-message error">{errors.contact}</span>}</div>
            <div className="field"><label htmlFor="email">Email corporativo *</label><input id="email" name="email" type="email" required aria-invalid={Boolean(errors.email)} />{errors.email && <span className="form-message error">{errors.email}</span>}</div>
            <div className="field"><label htmlFor="phone">Teléfono *</label><input id="phone" name="phone" placeholder="+34 600 000 000" required aria-invalid={Boolean(errors.phone)} />{errors.phone && <span className="form-message error">{errors.phone}</span>}</div>
            <div className="field"><label htmlFor="country">País de operación *</label><select id="country" name="country" defaultValue="" aria-invalid={Boolean(errors.country)}><option value="">Selecciona una opción</option><option>Estados Unidos</option><option>España</option><option>Ambos</option><option>Otro</option></select>{errors.country && <span className="form-message error">{errors.country}</span>}</div>
            <div className="field"><label htmlFor="product">Tipo de producto *</label><select id="product" name="product" defaultValue="" aria-invalid={Boolean(errors.product)}><option value="">Selecciona una opción</option><option>Moda</option><option>Electrónica</option><option>Cosmética</option><option>Alimentación</option><option>Otro</option></select>{errors.product && <span className="form-message error">{errors.product}</span>}</div>
            <div className="field"><label htmlFor="volume">Envíos mensuales *</label><select id="volume" name="volume" defaultValue="" aria-invalid={Boolean(errors.volume)}><option value="">Selecciona una opción</option><option>0-100</option><option>101-500</option><option>501-2000</option><option>2000+</option><option>No estoy seguro</option></select>{errors.volume && <span className="form-message error">{errors.volume}</span>}</div>
            <div className="field"><label htmlFor="website">Sitio web</label><input id="website" name="website" type="url" placeholder="https://" aria-invalid={Boolean(errors.website)} />{errors.website && <span className="form-message error">{errors.website}</span>}</div>
            <div className="field full"><span style={{ fontSize: '.8rem', fontWeight: 700 }}>Servicios de interés *</span><div className="checks">{['Almacenaje', 'Última milla', 'Logística inversa'].map((service) => <label className="check" key={service}><input type="checkbox" name="services" value={service} aria-invalid={Boolean(errors.services)} />{service}</label>)}</div>{errors.services && <span className="form-message error">{errors.services}</span>}</div>
            <div className="field full"><label className="check"><input type="checkbox" name="privacy" required aria-invalid={Boolean(errors.privacy)} /><span>Acepto la política de privacidad *</span></label>{errors.privacy && <span className="form-message error">{errors.privacy}</span>}</div>
          </div>
          <button className="button button-primary" type="submit" style={{ marginTop: 20 }}>Solicitar información ↗</button>
        </form>}
      </div>
    </section>
    <footer className="site-footer"><div className="container footer-row"><span>© 2025 TrackFlow. Todos los derechos reservados.</span><span style={{ display: 'flex', gap: 18 }}><Link href="/login">Acceder</Link></span></div></footer>
  </main>;
}
