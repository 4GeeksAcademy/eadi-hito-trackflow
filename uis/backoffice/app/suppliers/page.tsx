'use client';

import { FormEvent, startTransition, useEffect, useState } from 'react';
import Link from 'next/link';

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';
const categories = [
  'carrier_last_mile',
  'carrier_international',
  'warehouse_supplies',
  'packaging_materials',
  'reverse_logistics',
  'fleet_maintenance',
  'it_and_wms_software',
  'cleaning_and_facilities',
];

type Supplier = {
  id: number;
  name: string;
  country: 'USA' | 'Spain';
  categories: string[];
  rate_per_shipment: number;
  currency: 'USD' | 'EUR';
  updated_at: string;
  status: 'active' | 'suspended';
  service_zone?: string | null;
  contact_email?: string | null;
  notes?: string | null;
};

type SupplierForm = Omit<Supplier, 'id' | 'updated_at' | 'currency'>;

const emptyForm: SupplierForm = {
  name: '',
  country: 'USA',
  categories: ['carrier_last_mile'],
  rate_per_shipment: 1,
  status: 'active',
  service_zone: '',
  contact_email: '',
  notes: '',
};

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, options);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = typeof payload.detail === 'string' ? payload.detail : 'La API rechazó la operación.';
    throw new Error(detail);
  }
  return payload as T;
}

async function fetchSuppliers(country: string, category: string): Promise<Supplier[]> {
  const params = new URLSearchParams();
  if (country) params.set('country', country);
  if (category) params.set('category', category);
  const query = params.toString();
  return requestJson<Supplier[]>(`/suppliers${query ? `?${query}` : ''}`);
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [country, setCountry] = useState('');
  const [category, setCategory] = useState('');
  const [form, setForm] = useState<SupplierForm>(emptyForm);
  const [rateDrafts, setRateDrafts] = useState<Record<number, string>>({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchSuppliers(country, category)
      .then((result) => startTransition(() => setSuppliers(result)))
      .catch((requestError: Error) => setError(requestError.message));
  }, [country, category]);

  function updateForm<K extends keyof SupplierForm>(field: K, value: SupplierForm[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function toggleCategory(value: string) {
    const nextCategories = form.categories.includes(value)
      ? form.categories.filter((item) => item !== value)
      : [...form.categories, value];
    updateForm('categories', nextCategories);
  }

  async function createSupplier(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (form.categories.length === 0) {
      setError('Selecciona al menos una categoría.');
      return;
    }
    try {
      await requestJson<Supplier>('/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, currency: form.country === 'USA' ? 'USD' : 'EUR' }),
      });
      setForm(emptyForm);
      setMessage('Proveedor registrado correctamente.');
      const result = await fetchSuppliers(country, category);
      setSuppliers(result);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo registrar el proveedor.');
    }
  }

  async function updateRate(supplier: Supplier) {
    setError('');
    setMessage('');
    try {
      const updated = await requestJson<Supplier>(`/suppliers/${supplier.id}/rate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rate_per_shipment: Number(rateDrafts[supplier.id] ?? supplier.rate_per_shipment) }),
      });
      setSuppliers((current) => current.map((item) => item.id === updated.id ? updated : item));
      setMessage(`Tarifa de ${updated.name} actualizada.`);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar la tarifa.');
    }
  }

  async function toggleStatus(supplier: Supplier) {
    const nextStatus = supplier.status === 'active' ? 'suspended' : 'active';
    try {
      const updated = await requestJson<Supplier>(`/suppliers/${supplier.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      setSuppliers((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo cambiar el estado.');
    }
  }

  return (
    <main className="supplier-page">
      <header className="supplier-header">
        <div><p className="eyebrow">TrackFlow Ops · directorio centralizado</p><h1>Proveedores</h1><p>Gestiona carriers, suministros y software operacional de USA y Spain.</p></div>
        <Link className="back-link" href="/">Volver al resumen</Link>
      </header>
      {message && <p className="success-message" role="status">{message}</p>}
      {error && <p className="incident-error" role="alert">{error}</p>}
      <section className="supplier-layout">
        <div>
          <section className="supplier-toolbar" aria-label="Filtros de proveedores">
            <label>País<select value={country} onChange={(event) => setCountry(event.target.value)}><option value="">Todos</option><option value="USA">USA</option><option value="Spain">Spain</option></select></label>
            <label>Categoría<select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas</option>{categories.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
          </section>
          <section className="supplier-table-panel"><div className="panel-heading"><h2>Directorio</h2><span>{suppliers.length} proveedores</span></div><div className="supplier-table-wrap"><table className="supplier-table"><caption className="visually-hidden">Listado de proveedores de TrackFlow</caption><thead><tr><th>Proveedor</th><th>País</th><th>Categorías</th><th>Tarifa</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{suppliers.map((supplier) => <tr key={supplier.id}><td><strong>{supplier.name}</strong><small>{supplier.service_zone ?? 'Zona no indicada'}</small></td><td>{supplier.country}</td><td>{supplier.categories.join(', ')}</td><td><div className="rate-editor"><input aria-label={`Tarifa de ${supplier.name}`} type="number" min="0.01" step="0.01" value={rateDrafts[supplier.id] ?? supplier.rate_per_shipment} onChange={(event) => setRateDrafts((current) => ({ ...current, [supplier.id]: event.target.value }))} /><span>{supplier.currency}</span><button type="button" onClick={() => void updateRate(supplier)}>Guardar</button></div></td><td><span className={`supplier-status ${supplier.status}`}>{supplier.status === 'active' ? 'Activo' : 'Suspendido'}</span></td><td><button type="button" className="text-button" onClick={() => void toggleStatus(supplier)}>{supplier.status === 'active' ? 'Suspender' : 'Activar'}</button></td></tr>)}</tbody></table></div></section>
        </div>
        <form className="supplier-form" onSubmit={createSupplier}><h2>Nuevo proveedor</h2><label>Nombre<input required minLength={1} value={form.name} onChange={(event) => updateForm('name', event.target.value)} /></label><label>País<select value={form.country} onChange={(event) => { const nextCountry = event.target.value as SupplierForm['country']; updateForm('country', nextCountry); }}><option value="USA">USA</option><option value="Spain">Spain</option></select></label><fieldset><legend>Categorías</legend>{categories.map((value) => <label className="checkbox-label" key={value}><input type="checkbox" checked={form.categories.includes(value)} onChange={() => toggleCategory(value)} />{value}</label>)}</fieldset><label>Tarifa por envío<input required type="number" min="0.01" step="0.01" value={form.rate_per_shipment} onChange={(event) => updateForm('rate_per_shipment', Number(event.target.value))} /></label><label>Zona de servicio<input value={form.service_zone ?? ''} onChange={(event) => updateForm('service_zone', event.target.value)} /></label><label>Email de contacto<input type="email" value={form.contact_email ?? ''} onChange={(event) => updateForm('contact_email', event.target.value)} /></label><label>Notas<textarea value={form.notes ?? ''} onChange={(event) => updateForm('notes', event.target.value)} /></label><button className="primary-button" type="submit">Registrar proveedor</button></form>
      </section>
    </main>
  );
}
