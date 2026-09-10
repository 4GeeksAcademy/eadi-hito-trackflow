'use client';

import { ChangeEvent, useState } from 'react';
import Link from 'next/link';

type InvalidDetail = { row_number: number; reasons: string[] };
type Analysis = {
  total_records: number;
  valid_records: number;
  invalid_records: number;
  invalid_by_type: Record<string, number>;
  by_category: Record<string, number>;
  by_status: Record<string, number>;
  average_satisfaction_closed: number | null;
  invalid_records_detail: InvalidDetail[];
};

const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

export default function IncidentsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function analyzeFile(file: File) {
    setFileName(file.name);
    setError('');
    setAnalysis(null);
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Selecciona un fichero con extensión .csv.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/incidents/analyze`, { method: 'POST', body: formData });
      const payload = await response.json() as Analysis | { detail?: string };
      if (!response.ok) throw new Error('detail' in payload ? payload.detail : 'No se pudo analizar el fichero.');
      setAnalysis(payload as Analysis);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo conectar con la API.');
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) void analyzeFile(file);
  }

  return <main className="incident-page"><header className="incident-header"><div><p className="eyebrow">TrackFlow Ops · logística y última milla</p><h1>Analizador de incidencias</h1><p>Valida el CSV de operaciones de Los Ángeles y Zaragoza y convierte las anomalías en una lectura accionable.</p></div><Link className="back-link" href="/">← Volver al resumen</Link></header><section className="upload-panel" aria-labelledby="upload-title"><div><h2 id="upload-title">Carga un informe CSV</h2><p>Formato esperado: `incident_id`, fecha, país, cliente, carrier, categoría, estado y satisfacción.</p></div><label className="file-drop"><span>{loading ? 'Analizando…' : 'Seleccionar incidents-TRACKFLOW.csv'}</span><input type="file" accept=".csv,text/csv" onChange={handleFileChange} disabled={loading} /></label>{fileName && <p className="file-name">Fichero seleccionado: {fileName}</p>}{error && <p className="incident-error" role="alert">{error}</p>}</section>{analysis && <div className="analysis-content"><section className="incident-kpis" aria-label="Métricas generales"><Metric label="Procesados" value={analysis.total_records} /><Metric label="Válidos" value={analysis.valid_records} /><Metric label="Inválidos" value={analysis.invalid_records} tone={analysis.invalid_records ? 'warning' : undefined} /><Metric label="Satisfacción media en cierres" value={analysis.average_satisfaction_closed ?? 'N/D'} /></section><section className="analysis-grid"><AnalysisTable title="Por categoría" values={analysis.by_category} /><AnalysisTable title="Por estado" values={analysis.by_status} /><section className="analysis-card"><h2>Problemas de validación</h2>{Object.keys(analysis.invalid_by_type).length === 0 ? <p>No se detectaron registros inválidos.</p> : <ul>{Object.entries(analysis.invalid_by_type).map(([key, value]) => <li key={key}><span>{key}</span><strong>{value}</strong></li>)}</ul>}</section></section><a className="download-button" href={`${apiBase}/api/incidents/results/export`}>Descargar resultados CSV ↓</a></div>}</main>;
}

function Metric({ label, value, tone }: { label: string; value: string | number; tone?: 'warning' }) {
  return <article className={`metric ${tone ?? ''}`}><span>{label}</span><strong>{value}</strong></article>;
}

function AnalysisTable({ title, values }: { title: string; values: Record<string, number> }) {
  return <section className="analysis-card"><h2>{title}</h2><table><thead><tr><th scope="col">Valor</th><th scope="col">Total</th></tr></thead><tbody>{Object.entries(values).map(([key, value]) => <tr key={key}><td>{key}</td><td>{value}</td></tr>)}</tbody></table></section>;
}
