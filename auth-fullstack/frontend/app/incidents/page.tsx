'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import Link from 'next/link';

type Incident = {
  id: string;
  type: string;
  carrier: string;
  status: 'Abierta' | 'En revisión' | 'Resuelta';
  priority: 'Alta' | 'Media' | 'Baja';
  date: string;
};

const demoIncidents: Incident[] = [
  { id: 'INC-2048', type: 'Entrega fallida', carrier: 'SEUR', status: 'Abierta', priority: 'Alta', date: '09 sep 2026' },
  { id: 'INC-2047', type: 'Paquete dañado', carrier: 'UPS', status: 'En revisión', priority: 'Media', date: '09 sep 2026' },
  { id: 'INC-2046', type: 'Dirección incorrecta', carrier: 'MRW', status: 'Abierta', priority: 'Media', date: '08 sep 2026' },
  { id: 'INC-2045', type: 'Retraso en tránsito', carrier: 'FedEx', status: 'Resuelta', priority: 'Baja', date: '08 sep 2026' },
];

function parseCsv(fileText: string): Incident[] {
  const rows = fileText.trim().split(/\r?\n/).slice(1);
  return rows.map((row, index) => {
    const [type = 'Incidencia importada', carrier = 'Sin asignar', status = 'Abierta', priority = 'Media', date = 'Hoy'] = row.split(',').map((value) => value.trim());
    return { id: `CSV-${String(index + 1).padStart(3, '0')}`, type, carrier, status: status as Incident['status'], priority: priority as Incident['priority'], date };
  }).filter((incident) => incident.type);
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState(demoIncidents);
  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [query, setQuery] = useState('');

  const filteredIncidents = useMemo(() => incidents.filter((incident) =>
    `${incident.id} ${incident.type} ${incident.carrier} ${incident.status}`.toLowerCase().includes(query.toLowerCase()),
  ), [incidents, query]);

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onerror = () => {
      setMessage('No se pudo leer el archivo. Selecciona otro CSV e inténtalo de nuevo.');
    };
    reader.onload = () => {
      try {
        const imported = parseCsv(String(reader.result ?? ''));
        if (imported.length === 0) {
          setMessage('El archivo no contiene filas de incidencias válidas. Selecciona otro CSV.');
          return;
        }
        setIncidents(imported);
        setMessage(`${imported.length} incidencias cargadas correctamente.`);
      } catch {
        setMessage('No se pudo interpretar el CSV. Revisa el formato e inténtalo de nuevo.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="incident-page">
      <header className="incident-header">
        <div>
          <p className="eyebrow">TrackFlow Ops · Control operativo</p>
          <h1>Incidencias</h1>
          <p>Centraliza los problemas de última milla, prioriza los casos urgentes y da seguimiento a cada resolución.</p>
        </div>
        <Link className="back-link" href="/ops">← Volver al panel</Link>
      </header>

      <section className="upload-panel" aria-labelledby="upload-title">
        <h2 id="upload-title">Importar incidencias</h2>
        <p>Sube un CSV para sustituir la vista de demostración. Columnas esperadas: tipo, transportista, estado, prioridad y fecha.</p>
        <label className="file-drop" htmlFor="incident-file">
          <input id="incident-file" type="file" accept=".csv,text/csv" onChange={handleFile} />
          {fileName ? <span className="file-name">{fileName}</span> : <span>Seleccionar archivo CSV</span>}
        </label>
        {message && <p className="incident-error" role="status">{message}</p>}
      </section>

      <section className="analysis-content" aria-labelledby="overview-title">
        <div className="incident-kpis">
          <div className="metric"><span>Total de incidencias</span><strong>{incidents.length}</strong></div>
          <div className="metric warning"><span>Prioridad alta</span><strong>{incidents.filter((item) => item.priority === 'Alta').length}</strong></div>
          <div className="metric"><span>En revisión</span><strong>{incidents.filter((item) => item.status === 'En revisión').length}</strong></div>
          <div className="metric"><span>Resueltas</span><strong>{incidents.filter((item) => item.status === 'Resuelta').length}</strong></div>
        </div>
        <div className="analysis-card">
          <div className="panel-heading"><h2 id="overview-title">Registro de incidencias</h2><label><span className="visually-hidden">Buscar incidencias</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar…" /></label></div>
          <div className="supplier-table-wrap">
            <table className="supplier-table"><caption className="visually-hidden">Listado de incidencias operativas</caption><thead><tr><th>ID</th><th>Incidencia</th><th>Transportista</th><th>Estado</th><th>Prioridad</th><th>Fecha</th></tr></thead><tbody>{filteredIncidents.map((incident) => <tr key={incident.id}><td><strong>{incident.id}</strong></td><td>{incident.type}</td><td>{incident.carrier}</td><td><span className={`supplier-status ${incident.status === 'Resuelta' ? 'active' : 'suspended'}`}>{incident.status}</span></td><td>{incident.priority}</td><td>{incident.date}</td></tr>)}</tbody></table>
          </div>
        </div>
      </section>
    </div>
  );
}
