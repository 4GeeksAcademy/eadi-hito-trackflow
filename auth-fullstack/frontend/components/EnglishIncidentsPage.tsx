'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocale } from './LocaleProvider';
import { OpsSectionShell } from './OpsSidebar';
import { localizedPath } from '../lib/i18n';

type Incident = { id: number; title: string; description: string; category: string; status: 'open' | 'in_progress' | 'resolved' | 'discarded'; origin: 'customer' | 'branch' | 'internal'; branch: string; created_at: string; updated_at: string };
type Summary = { by_status: Record<string, number> };

const statuses = ['open', 'in_progress', 'resolved', 'discarded'] as const;
const transitions: Record<Incident['status'], Incident['status'][]> = { open: ['in_progress', 'discarded'], in_progress: ['resolved', 'discarded'], resolved: [], discarded: [] };
const categories = ['lost_parcel', 'delivery_failure', 'inventory_discrepancy', 'carrier_issue', 'returns_issue', 'warehouse_incident', 'system_failure', 'client_complaint', 'other'];
const locations: Record<string, string> = { central: 'Central', la_warehouse: 'Los Angeles · Warehouse', la_office: 'Los Angeles · Office', zaragoza_warehouse: 'Zaragoza · Warehouse', zaragoza_office: 'Zaragoza · Office' };

export default function EnglishIncidentsPage() {
  const locale = useLocale();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [status, setStatus] = useState('');
  const [origin, setOrigin] = useState('');
  const [branch, setBranch] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);
  const query = useMemo(() => new URLSearchParams(Object.entries({ status, origin, branch, category }).filter(([, value]) => value)), [status, origin, branch, category]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [listResponse, summaryResponse] = await Promise.all([fetch(`/api/incidents?${query}`), fetch('/api/incidents/summary')]);
      if (!listResponse.ok || !summaryResponse.ok) throw new Error('Could not load incidents.');
      setIncidents(await listResponse.json());
      setSummary(await summaryResponse.json());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Connection error.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 0); return () => window.clearTimeout(timer); }, [load]);

  async function changeStatus(incident: Incident, next: Incident['status']) {
    const previous = incidents;
    setUpdating(incident.id);
    setIncidents(previous.map((item) => item.id === incident.id ? { ...item, status: next } : item));
    try {
      const response = await fetch(`/api/incidents/${incident.id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) });
      if (!response.ok) throw new Error('This status transition is not allowed.');
      setSummary(await (await fetch('/api/incidents/summary')).json());
    } catch (statusError) {
      setIncidents(previous);
      setError(statusError instanceof Error ? statusError.message : 'Could not update the status.');
    } finally {
      setUpdating(null);
    }
  }

  const statusLabel = (value: string) => ({ open: 'Open', in_progress: 'In progress', resolved: 'Resolved', discarded: 'Discarded' })[value] ?? value;
  const categoryLabel = (value: string) => ({ lost_parcel: 'Lost parcel', delivery_failure: 'Delivery failure', inventory_discrepancy: 'Inventory discrepancy', carrier_issue: 'Carrier issue', returns_issue: 'Returns issue', warehouse_incident: 'Warehouse incident', system_failure: 'System failure', client_complaint: 'Client complaint', other: 'Other' })[value] ?? value;

  return <OpsSectionShell section="incidents"><main className="incident-page"><header className="incident-header"><div><p className="eyebrow">TrackFlow Ops · Operations control</p><h1>Incidents</h1><p>Centralize and track every operational issue.</p></div><Link className="inventory-back" href={localizedPath('/incidents/new', locale)}>＋ Report incident</Link></header>
    {summary && <section className="incident-kpis">{statuses.map((key) => <div className="metric" key={key}><span>{statusLabel(key)}</span><strong>{summary.by_status[key] ?? 0}</strong></div>)}</section>}
    <section className="analysis-card"><div className="panel-heading"><h2>Incident register</h2><div className="incident-filters"><select aria-label="Filter by status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option>{statuses.map((key) => <option key={key} value={key}>{statusLabel(key)}</option>)}</select><select aria-label="Filter by origin" value={origin} onChange={(event) => setOrigin(event.target.value)}><option value="">All origins</option><option value="customer">Customer</option><option value="branch">Branch</option><option value="internal">Internal</option></select><select aria-label="Filter by category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">All categories</option>{categories.map((key) => <option key={key} value={key}>{categoryLabel(key)}</option>)}</select><select aria-label="Filter by location" value={branch} onChange={(event) => setBranch(event.target.value)}><option value="">All locations</option>{Object.entries(locations).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div></div>
      {error && <div className="incident-error" role="alert">{error} <button type="button" onClick={() => void load()}>Retry</button></div>}{loading ? <p role="status">Loading incidents…</p> : incidents.length === 0 ? <p>No incidents match these filters.</p> : <div className="supplier-table-wrap"><table className="supplier-table"><thead><tr><th>ID</th><th>Title</th><th>Category</th><th>Origin / location</th><th>Status</th><th>Date</th></tr></thead><tbody>{incidents.map((incident) => <tr key={incident.id}><td>{incident.id}</td><td><strong>{incident.title}</strong><br /><small>{incident.description}</small></td><td>{categoryLabel(incident.category)}</td><td>{{ customer: 'Customer', branch: 'Branch', internal: 'Internal' }[incident.origin]} / {locations[incident.branch] ?? incident.branch}</td><td><select disabled={updating === incident.id} value={incident.status} onChange={(event) => void changeStatus(incident, event.target.value as Incident['status'])}>{statuses.map((key) => <option key={key} value={key} disabled={key !== incident.status && !transitions[incident.status].includes(key)}>{statusLabel(key)}</option>)}</select></td><td>{new Date(incident.created_at).toLocaleDateString('en-US')}</td></tr>)}</tbody></table></div>}</section>
  </main></OpsSectionShell>;
}