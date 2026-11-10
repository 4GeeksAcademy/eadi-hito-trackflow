'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import LanguageSwitch from './LanguageSwitch';
import ThemeToggle from './ThemeToggle';
import { localizedPath } from '../lib/i18n';

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
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
  const { title, links } = sections[section];
  const localizedTitle = isEnglish
    ? { inventory: 'Inventory', incidents: 'Incidents', suppliers: 'Suppliers', candidates: 'Candidates' }[section]
    : title;

  return (
    <aside className="sidebar ops-section-sidebar">
      <div className="ops-sidebar-heading"><div className="brand">Track<span>Flow</span></div><div className="ops-sidebar-tools"><LanguageSwitch /><ThemeToggle /></div></div>
      <nav aria-label={isEnglish ? `${localizedTitle} navigation` : `Navegación de ${title}`}>
        <div className="side-label">{localizedTitle}</div>
        {links.map(({ href, label, icon }) => (
          <Link className={`side-link${pathname === localizedPath(href, isEnglish ? 'en' : 'es') ? ' active' : ''}`} href={localizedPath(href, isEnglish ? 'en' : 'es')} aria-current={pathname === localizedPath(href, isEnglish ? 'en' : 'es') ? 'page' : undefined} title={isEnglish ? ({ 'Registrar incidencia': 'Report an incident', 'Registrar entrada': 'Register inbound stock', 'Registrar salida': 'Register outbound stock', 'Ver historial de órdenes': 'View order history' }[label] ?? label) : label} key={href}>
            <span aria-hidden="true">{icon}</span> {isEnglish ? ({ 'Registrar incidencia': 'Report an incident', 'Registrar entrada': 'Register inbound stock', 'Registrar salida': 'Register outbound stock', 'Ver historial de órdenes': 'View order history' }[label] ?? label) : label}
          </Link>
        ))}
        <div className="side-label">{isEnglish ? 'Links' : 'Enlaces'}</div>
        <Link className="side-link" href={localizedPath('/ops', isEnglish ? 'en' : 'es')} title={isEnglish ? 'Back to Ops dashboard' : 'Volver al panel Ops'}><span aria-hidden="true">◈</span> {isEnglish ? 'Back to Ops dashboard' : 'Volver al panel Ops'}</Link>
        <Link className="side-link" href={localizedPath('/', isEnglish ? 'en' : 'es')} title={isEnglish ? 'Back to home' : 'Volver al inicio'}><span aria-hidden="true">⌂</span> {isEnglish ? 'Back to home' : 'Volver al inicio'}</Link>
      </nav>
    </aside>
  );
}

export function OpsSectionShell({ section, children }: { section: Section; children: ReactNode }) {
  return <div className="ops-shell ops-section-shell"><OpsSidebar section={section} />{children}</div>;
}