'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { OpsSectionShell } from '../../../components/OpsSidebar';
import { useLocale } from '../../../components/LocaleProvider';
import { localizedPath } from '../../../lib/i18n';

const categories = ['lost_parcel', 'delivery_failure', 'inventory_discrepancy', 'carrier_issue', 'returns_issue', 'warehouse_incident', 'system_failure', 'client_complaint', 'other'];
const branches = { central: 'Central', la_warehouse: 'Los Ángeles — Almacén', la_office: 'Los Ángeles — Oficina', zaragoza_warehouse: 'Zaragoza — Almacén', zaragoza_office: 'Zaragoza — Oficina' };

export default function NewIncidentPage() {
  const locale = useLocale();
  const isEnglish = locale === 'en';
  const branchLabels = isEnglish ? { central: 'Central', la_warehouse: 'Los Angeles · Warehouse', la_office: 'Los Angeles · Office', zaragoza_warehouse: 'Zaragoza · Warehouse', zaragoza_office: 'Zaragoza · Office' } : branches;
  const categoryLabels = isEnglish ? { lost_parcel: 'Lost parcel', delivery_failure: 'Delivery failure', inventory_discrepancy: 'Inventory discrepancy', carrier_issue: 'Carrier issue', returns_issue: 'Returns issue', warehouse_incident: 'Warehouse incident', system_failure: 'System failure', client_complaint: 'Client complaint', other: 'Other' } : null;
  const [form, setForm] = useState({ title: '', description: '', category: 'other', origin: 'internal', branch: 'central' });
  const [descriptionDraft, setDescriptionDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const descriptionDialog = useRef<HTMLDialogElement>(null);

  function openDescriptionDialog() {
    setDescriptionDraft(form.description);
    descriptionDialog.current?.showModal();
  }

  function acceptDescription() {
    if (!descriptionDraft.trim()) return;
    setForm((current) => ({ ...current, description: descriptionDraft }));
    setError('');
    descriptionDialog.current?.close();
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!form.description.trim()) {
      openDescriptionDialog();
      return;
    }
    setBusy(true);
    try {
      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('No se pudo registrar la incidencia. Revisa los campos e inténtalo de nuevo.');
      setForm({ title: '', description: '', category: 'other', origin: 'internal', branch: 'central' });
      setMessage('Incidencia registrada correctamente.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo registrar la incidencia.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <OpsSectionShell section="incidents">
      <main className="incident-page incident-create-page">
        <header className="incident-header">
          <div>
            <p className="eyebrow">{isEnglish ? 'TrackFlow Ops · Operations control' : 'TrackFlow Ops · Control operativo'}</p>
            <h1>{isEnglish ? 'Report an incident' : 'Registrar incidencia'}</h1>
            <p>{isEnglish ? 'Record an operational issue with the information needed to follow it through.' : 'Registra un problema operativo con la información necesaria para darle seguimiento.'}</p>
          </div>
        </header>

        <section className="incident-create-panel" aria-labelledby="incident-create-title">
          <div className="incident-create-heading">
            <p className="eyebrow">{isEnglish ? 'New report' : 'Nuevo registro'}</p>
            <h2 id="incident-create-title">{isEnglish ? 'Incident details' : 'Datos de la incidencia'}</h2>
            <p>{isEnglish ? 'Complete the details and add a full description before submitting.' : 'Completa los datos y añade una descripción detallada antes de registrar.'}</p>
          </div>

          {error && <p className="incident-error" role="alert">{error}</p>}
          {message && <p className="success-message" role="status">{message}</p>}

          <form onSubmit={submit} className="incident-create-form">
            <label className="incident-create-label">
              <span className="incident-label-row"><span>{isEnglish ? 'Title' : 'Título'}</span><span className="incident-field-note">{isEnglish ? 'Required' : 'Obligatorio'}</span></span>
              <input required minLength={1} maxLength={120} value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            </label>

            <div className="incident-create-label incident-description-field">
              <div className="incident-label-row"><span id="incident-description-label">{isEnglish ? 'Description' : 'Descripción'}</span><span className="incident-field-note">{isEnglish ? 'Required' : 'Obligatoria'}</span></div>
              <button className="incident-description-trigger" type="button" aria-haspopup="dialog" aria-labelledby="incident-description-label" aria-describedby="incident-description-hint" onClick={openDescriptionDialog}>
                <span className="incident-description-trigger-title">{form.description ? (isEnglish ? 'Edit description' : 'Editar descripción') : (isEnglish ? 'Write a description' : 'Escribir descripción')}</span>
                <span id="incident-description-hint" className="incident-description-hint">{form.description ? (isEnglish ? `${form.description.length} characters · Select to edit` : `${form.description.length} caracteres · Selecciona para editar`) : (isEnglish ? 'Add the issue details here' : 'Añade aquí el detalle del problema')}</span>
                {form.description && <span className="incident-description-preview">{form.description}</span>}
              </button>
            </div>

            <div className="incident-form-options">
              <label className="incident-create-label">
                <span>{isEnglish ? 'Category' : 'Categoría'}</span>
                <select value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}>
                  {categories.map((category) => <option key={category} value={category}>{categoryLabels?.[category as keyof typeof categoryLabels] ?? category}</option>)}
                </select>
              </label>
              <label className="incident-create-label">
                <span>{isEnglish ? 'Origin' : 'Origen'}</span>
                <select value={form.origin} onChange={(event) => setForm((current) => ({ ...current, origin: event.target.value }))}>
                  <option value="customer">{isEnglish ? 'Customer' : 'Cliente'}</option>
                  <option value="branch">{isEnglish ? 'Branch' : 'Sede'}</option>
                  <option value="internal">{isEnglish ? 'Internal' : 'Interno'}</option>
                </select>
              </label>
              <label className="incident-create-label">
                <span>{isEnglish ? 'Location' : 'Sede'}</span>
                <select required value={form.branch} onChange={(event) => setForm((current) => ({ ...current, branch: event.target.value }))}>
                  {Object.entries(branchLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>
            </div>

            <div className="incident-form-actions">
              <Link className="inventory-back" href={localizedPath('/incidents', locale)}>{isEnglish ? 'Back to incidents' : 'Volver a incidencias'}</Link>
              <button className="primary-button" type="submit" disabled={busy}>{busy ? (isEnglish ? 'Saving…' : 'Guardando…') : (isEnglish ? 'Report incident' : 'Registrar incidencia')}</button>
            </div>
          </form>
        </section>

        <dialog ref={descriptionDialog} className="incident-description-dialog" aria-labelledby="incident-dialog-title">
          <header className="incident-dialog-heading">
            <div>
              <p className="eyebrow">{isEnglish ? 'Operational details' : 'Detalle operativo'}</p>
              <h2 id="incident-dialog-title">{isEnglish ? 'Incident description' : 'Descripción de la incidencia'}</h2>
            </div>
            <button className="inventory-refresh" type="button" onClick={() => descriptionDialog.current?.close()} aria-label={isEnglish ? 'Close description' : 'Cerrar descripción'}>×</button>
          </header>
          <label className="incident-dialog-label" htmlFor="incident-description">{isEnglish ? 'Description' : 'Descripción'} <span>{isEnglish ? 'Required' : 'Obligatoria'}</span></label>
          <textarea id="incident-description" autoFocus required value={descriptionDraft} onChange={(event) => setDescriptionDraft(event.target.value)} placeholder={isEnglish ? 'Describe what happened, when it happened, and any details that may help resolve it.' : 'Describe qué ocurrió, cuándo y cualquier detalle útil para resolverlo.'} />
          <footer className="incident-dialog-footer">
            <span>{descriptionDraft.length} caracteres</span>
            <div className="incident-dialog-actions">
              <button className="inventory-back" type="button" onClick={() => descriptionDialog.current?.close()}>{isEnglish ? 'Cancel' : 'Cancelar'}</button>
              <button className="primary-button" type="button" disabled={!descriptionDraft.trim()} onClick={acceptDescription}>{isEnglish ? 'Accept' : 'Aceptar'}</button>
            </div>
          </footer>
        </dialog>
      </main>
    </OpsSectionShell>
  );
}
