'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { OpsSectionShell } from '../../components/OpsSidebar';

export default function InventoryShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (!window.localStorage.getItem('trackflow_access_token')) {
      router.replace('/login');
      return;
    }
  }, [router]);

  return (
    <>
      <a className="skip-link" href="#inventory-content">Ir al contenido principal</a>
      <OpsSectionShell section="inventory">
        <main className="main inventory-main" id="inventory-content">
          {children}
        </main>
      </OpsSectionShell>
    </>
  );
}
