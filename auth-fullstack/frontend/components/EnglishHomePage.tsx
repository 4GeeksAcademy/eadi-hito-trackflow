'use client';

import Image from 'next/image';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import SiteNavbar from './SiteNavbar';
import CandidateApplicationForm from './CandidateApplicationForm';

const services = [
  { number: '01', title: 'Warehouse management', copy: 'Visible inventory and coordinated operations from Los Angeles and Zaragoza.', items: ['Storage, picking, and packing', 'Real-time inventory', 'Low-stock alerts'] },
  { number: '02', title: 'Last mile', copy: 'A carrier network and tracking that turn promises into deliveries.', items: ['Network of 8 carriers', 'Unified tracking', 'Incident management'] },
  { number: '03', title: 'Reverse logistics', copy: 'Faster, consistent returns connected to your platform.', items: ['Approvals and pickups', 'Inspection and refurbishment', 'Pattern analysis'] },
];

export default function EnglishHomePage() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function getFieldError(form: FormData, name: string) {
    const value = String(form.get(name) || '').trim();
    if (name === 'company' && value.length < 2) return 'Company name must be at least 2 characters long.';
    if (name === 'contact' && value.split(/\s+/).filter(Boolean).length < 2) return 'Enter the contact’s first and last name.';
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid business email address.';
    if (name === 'phone' && !/^\+\d[\d ]{6,}$/.test(value)) return 'Include a country code (for example: +1 213 555 0147).';
    if (name === 'website' && value && !/^https?:\/\/[^\s]+$/.test(value)) return 'Enter a valid website URL, including http:// or https://.';
    if (['country', 'product', 'volume'].includes(name) && !value) return 'Please complete this field.';
    if (name === 'services' && !form.getAll('services').length) return 'Select at least one service of interest.';
    if (name === 'privacy' && !form.get('privacy')) return 'You must accept the privacy policy to continue.';
    return '';
  }

  function validateField(formElement: HTMLFormElement, name: string) {
    const message = getFieldError(new FormData(formElement), name);
    setErrors((current) => ({ ...current, [name]: message }));
    return !message;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
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
    <SiteNavbar />
    <section className="container hero-grid" id="inicio">
      <div><div className="eyebrow">TrackFlow Tech · since 2009</div><h1 className="hero-title">Logistics that scales with your e-commerce.</h1><p className="hero-copy">Warehousing, last-mile delivery, and reverse logistics in the United States and Spain. You grow your brand; we move what makes it possible.</p><a className="button button-light" href="#contact" style={{ marginTop: 28 }}>Let’s talk about your operation <span aria-hidden="true" style={{ marginLeft: 12 }}>↗</span></a> <a className="button button-primary" href="#careers" style={{ marginTop: 28 }}>Work with us</a></div>
      <div className="hero-art"><Image src="/landingpage.jpg" alt="TrackFlow distribution center with delivery trucks" fill sizes="(max-width: 800px) 100vw, 45vw" className="hero-photo" priority /></div>
    </section>
    <section className="section container" id="services"><div className="section-heading"><div><div className="eyebrow">One operation, one view</div><h2>Everything that happens after the click.</h2></div><p>We connect inventory, people, and carriers so every order moves forward with less friction.</p></div><div className="service-grid">{services.map((service) => <article className="service-card" key={service.number}><div className="service-number">{service.number}</div><h3>{service.title}</h3><p>{service.copy}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>
    <section className="section coverage-band" id="coverage"><div className="container"><div className="section-heading"><div><div className="eyebrow" style={{ color: 'var(--lime)' }}>Two countries. One operation.</div><h2>Visibility where your customer needs it.</h2></div><p style={{ color: '#bfd0c6' }}>Cross-border infrastructure built to grow with your markets.</p></div><div className="coverage-grid"><article className="coverage-card"><Image src="/coverage-us.png" alt="" fill sizes="(max-width: 560px) 100vw, 50vw" className="coverage-image" /><h3>United States</h3><p>Los Angeles warehouse<br />Nationwide coverage<br />UPS · FedEx · DHL</p></article><article className="coverage-card"><Image src="/coverage-spain.png" alt="" fill sizes="(max-width: 560px) 100vw, 50vw" className="coverage-image" /><h3>Spain</h3><p>Zaragoza warehouse<br />Mainland and island coverage<br />MRW · SEUR · DHL</p></article></div></div></section>
    <section className="section container"><div className="eyebrow">Why TrackFlow</div><div className="benefit-grid" style={{ marginTop: 32 }}><div className="benefit"><strong>Cross-border operations</strong><span>Our own infrastructure in the United States and Spain.</span></div><div className="benefit"><strong>130+ professionals</strong><span>Teams that know your operation from end to end.</span></div><div className="benefit"><strong>Purpose-built technology</strong><span>Inventory and delivery data at a glance.</span></div><div className="benefit"><strong>E-commerce native</strong><span>Fashion, electronics, and cosmetics are our specialty.</span></div></div></section>
    <section className="section container" id="contact"><div className="contact-panel"><div><div className="eyebrow">Let’s talk</div><h2 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', lineHeight: 1, margin: '14px 0 20px' }}>Your next delivery starts here.</h2><p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Tell us how your logistics work today, and we’ll show you what they can achieve tomorrow.</p><p style={{ marginTop: 34, lineHeight: 1.8, fontSize: '.9rem' }}><a href="mailto:comercial@trackflow.com">comercial@trackflow.com</a><br /><a href="tel:+12135550147">Los Angeles: +1 213 555 0147</a><br /><a href="tel:+34976123456">Zaragoza: +34 976 123 456</a></p></div>
      {submitted ? <div className="success"><strong>Thank you for your interest in TrackFlow!</strong><p>We’ve received your request. Our commercial team will contact you within 24–48 hours.</p><p><a href="mailto:comercial@trackflow.com">comercial@trackflow.com</a></p><button className="button button-primary" type="button" onClick={() => { setErrors({}); setSubmitted(false); }} style={{ marginTop: 16 }}>Submit another form</button></div> : <form onSubmit={submit} noValidate onBlur={(event) => {
        const target = event.target;
        if ((target instanceof HTMLInputElement || target instanceof HTMLSelectElement) && target.name) validateField(event.currentTarget, target.name);
      }} onChange={(event) => {
        const target = event.target;
        if ((target instanceof HTMLInputElement || target instanceof HTMLSelectElement) && errors[target.name]) validateField(event.currentTarget, target.name);
      }}><div className="form-grid">
        <div className="field"><label htmlFor="company">Company *</label><input id="company" name="company" minLength={2} required aria-invalid={Boolean(errors.company)} />{errors.company && <span className="form-message error">{errors.company}</span>}</div>
        <div className="field"><label htmlFor="contact">Contact name *</label><input id="contact" name="contact" required aria-invalid={Boolean(errors.contact)} />{errors.contact && <span className="form-message error">{errors.contact}</span>}</div>
        <div className="field"><label htmlFor="email">Business email *</label><input id="email" name="email" type="email" required aria-invalid={Boolean(errors.email)} />{errors.email && <span className="form-message error">{errors.email}</span>}</div>
        <div className="field"><label htmlFor="phone">Phone *</label><input id="phone" name="phone" type="tel" placeholder="+1 213 555 0147" required aria-invalid={Boolean(errors.phone)} />{errors.phone && <span className="form-message error">{errors.phone}</span>}</div>
        <div className="field"><label htmlFor="country">Operating country *</label><select id="country" name="country" defaultValue="" required aria-invalid={Boolean(errors.country)}><option value="">Select an option</option><option>United States</option><option>Spain</option><option>Both</option><option>Other</option></select>{errors.country && <span className="form-message error">{errors.country}</span>}</div>
        <div className="field"><label htmlFor="product">Product type *</label><select id="product" name="product" defaultValue="" required aria-invalid={Boolean(errors.product)}><option value="">Select an option</option><option>Fashion</option><option>Electronics</option><option>Cosmetics</option><option>Food and beverage</option><option>Other</option></select>{errors.product && <span className="form-message error">{errors.product}</span>}</div>
        <div className="field"><label htmlFor="volume">Monthly shipments *</label><select id="volume" name="volume" defaultValue="" required aria-invalid={Boolean(errors.volume)}><option value="">Select an option</option><option>0–100</option><option>101–500</option><option>501–2,000</option><option>2,000+</option><option>Not sure</option></select>{errors.volume && <span className="form-message error">{errors.volume}</span>}</div>
        <div className="field"><label htmlFor="website">Website</label><input id="website" name="website" type="url" placeholder="https://" aria-invalid={Boolean(errors.website)} />{errors.website && <span className="form-message error">{errors.website}</span>}</div>
        <div className="field full"><span style={{ fontSize: '.8rem', fontWeight: 700 }}>Services of interest *</span><div className="checks">{['Warehousing', 'Last mile', 'Reverse logistics'].map((service) => <label className="check" key={service}><input type="checkbox" name="services" value={service} aria-invalid={Boolean(errors.services)} />{service}</label>)}</div>{errors.services && <span className="form-message error">{errors.services}</span>}</div>
        <div className="field full"><label className="check"><input type="checkbox" name="privacy" required aria-invalid={Boolean(errors.privacy)} /><span>I agree to the privacy policy *</span></label>{errors.privacy && <span className="form-message error">{errors.privacy}</span>}</div>
      </div><button className="button button-primary" type="submit" style={{ marginTop: 20 }}>Request information ↗</button></form>}
    </div></section>
    <section className="section container" id="careers"><div className="contact-panel"><div><div className="eyebrow">TrackFlow team</div><h2 style={{ fontSize: 'clamp(2.3rem, 5vw, 4rem)', lineHeight: 1, margin: '14px 0 20px' }}>Work with us.</h2><p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>Tell us about your experience and attach your resume. Our recruiting team will review your application.</p></div><CandidateApplicationForm /></div></section>
    <footer className="site-footer"><div className="container footer-row"><span>© 2025 TrackFlow. All rights reserved.</span><span style={{ display: 'flex', gap: 18 }}><Link href="/en/login">Log in</Link></span></div></footer>
  </main>;
}