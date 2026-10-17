'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

type Section = 'inventory' | 'incidents' | 'suppliers' | 'candidates';

const sections = {
  inventory: {
    title: 'Inventario',
    links: [
      { href: '/inventory/orders/inbound', label: 'Registrar entrada', icon: '＋' },
      { href: '/inventory/orders/outbound', label: 'Registrar salida', icon: '−' },
      { href: '/inventory/orders', label: 'Ver historial de órdenes', icon: '▤' },
    ],
  },
  incidents: {
    title: 'Incidencias',
    links: [{ href: '/incidents/new', label: 'Registrar incidencia', icon: '＋' }],
  },
  suppliers: { title: 'Proveedores', links: [] },
  candidates: { title: 'Candidaturas', links: [] },
};

export default function OpsSidebar({ section }: { section: Section }) {
  const pathname = usePathname();
  const { title, links } = sections[section];

  return (
    <aside className="sidebar ops-section-sidebar">
      <div className="brand">Track<span>Flow</span></div>
      <nav aria-label={`Navegación de ${title}`}>
        <div className="side-label">{title}</div>
        {links.map(({ href, label, icon }) => (
          <Link className={`side-link${pathname === href ? ' active' : ''}`} href={href} aria-current={pathname === href ? 'page' : undefined} title={label} key={href}>
            <span aria-hidden="true">{icon}</span> {label}
          </Link>
        ))}
        <div className="side-label">Enlaces</div>
        <Link className="side-link" href="/ops" title="Volver al panel Ops"><span aria-hidden="true">◈</span> Volver al panel Ops</Link>
        <Link className="side-link" href="/" title="Volver al inicio"><span aria-hidden="true">⌂</span> Volver al inicio</Link>
      </nav>
    </aside>
  );
}

export function OpsSectionShell({ section, children }: { section: Section; children: ReactNode }) {
  return <div className="ops-shell ops-section-shell"><OpsSidebar section={section} />{children}</div>;
}