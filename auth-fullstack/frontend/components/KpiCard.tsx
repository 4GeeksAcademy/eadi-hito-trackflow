import type { ReactNode } from 'react';

type KpiCardProps = {
  label: string;
  value: ReactNode;
  note: string;
  noteVariant?: 'alert' | 'info';
};

export default function KpiCard({ label, value, note, noteVariant }: KpiCardProps) {
  return (
    <article className="kpi">
      <span className="kpi-label">{label}</span>
      <div className="kpi-value">{value}</div>
      <div className={`kpi-note${noteVariant ? ` ${noteVariant}` : ''}`}>{note}</div>
    </article>
  );
}