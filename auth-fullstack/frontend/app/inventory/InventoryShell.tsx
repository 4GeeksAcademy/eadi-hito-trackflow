'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

const links = [
  { href: '/inventory/products', label: 'Productos' },
  { href: '/inventory/orders/inbound', label: 'Registrar entrada' },
  { href: '/inventory/orders/outbound', label: 'Registrar salida' },
  { href: '/inventory/orders', label: 'Historial de órdenes' },
];

export default function InventoryShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!window.localStorage.getItem('trackflow_access_token')) {
      router.replace('/login');
      return;
    }
  }, [router]);

  return (
    <>
      <a className="skip-link" href="#inventory-content">Ir al contenido principal</a>
      <div className="ops-shell">
        <aside className="sidebar">
          <Link className="brand" href="/ops" aria-label="TrackFlow Ops, volver al resumen">Track<span>Flow</span></Link>
          <nav aria-label="Navegación principal del inventario">
            <div className="side-label">Operación</div>
            <Link className="side-link" href="/ops"><span aria-hidden="true">◈</span> Resumen</Link>
            <div className="side-label">Inventario</div>
            {links.map((link) => (
              <Link className={`side-link${pathname === link.href ? ' active' : ''}`} href={link.href} aria-current={pathname === link.href ? 'page' : undefined} key={link.href}>
                {link.label}
              </Link>
            ))}
            <div className="side-label">Empresa</div>
            <Link className="side-link" href="/incidents"><span aria-hidden="true">▤</span> Incidencias</Link>
            <Link className="side-link" href="/suppliers"><span aria-hidden="true">◌</span> Proveedores</Link>
            <div className="side-label">Enlaces</div>
            <Link className="side-link" href="/"><span aria-hidden="true">⌂</span> Ir a inicio</Link>
          </nav>
        </aside>
        <main className="main inventory-main" id="inventory-content">
          {children}
        </main>
      </div>
    </>
  );
}
