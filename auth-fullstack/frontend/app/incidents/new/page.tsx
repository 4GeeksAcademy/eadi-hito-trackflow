'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

const categories = ['lost_parcel', 'delivery_failure', 'inventory_discrepancy', 'carrier_issue', 'returns_issue', 'warehouse_incident', 'system_failure', 'client_complaint', 'other'];
const branches = { central: 'Central', la_warehouse: 'Los Ángeles — Almacén', la_office: 'Los Ángeles — Oficina', zaragoza_warehouse: 'Zaragoza — Almacén', zaragoza_office: 'Zaragoza — Oficina' };

export default function NewIncidentPage() {
  const [form, setForm] = useState({ title: '', description: '', category: 'other', origin: 'internal', branch: 'central' });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setMessage('');
    try {
      const response = await fetch('/api/incidents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error('No se pudo registrar la incidencia. Revisa los campos e inténtalo de nuevo.');
      setForm({ title: '', description: '', category: 'other', origin: 'internal', branch: 'central' }); setMessage('Incidencia registrada correctamente.');
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'No se pudo registrar la incidencia.'); } finally { setBusy(false); }
  }
  return <main className="incident-page"><header className="incident-header"><div><p className="eyebrow">TrackFlow Ops</p><h1>Registrar incidencia</h1><p>Registra un problema operativo con toda la información necesaria para darle seguimiento.</p></div><Link className="back-link" href="/incidents">← Ver incidencias</Link></header><section className="analysis-card"><form onSubmit={submit} className="auth-form"><label>Título<input required minLength={1} maxLength={120} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></label><label>Descripción<textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label><label>Categoría<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(category => <option key={category}>{category}</option>)}</select></label><label>Origen<select value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })}><option value="customer">Cliente</option><option value="branch">Sede</option><option value="internal">Interno</option></select></label><label className={form.origin === 'branch' ? 'field-highlight' : ''}>Sede<select required value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}>{Object.entries(branches).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>{error && <p className="incident-error" role="alert">{error}</p>}{message && <p className="success-message" role="status">{message}</p>}<button className="primary-button" disabled={busy}>{busy ? 'Guardando…' : 'Registrar incidencia'}</button></form></section></main>;
}
