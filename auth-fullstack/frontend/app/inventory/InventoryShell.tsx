'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { OpsSectionShell } from '../../components/OpsSidebar';
import { useLocale } from '../../components/LocaleProvider';
import { localizedPath, translate } from '../../lib/i18n';

export default function InventoryShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const locale = useLocale();
  useEffect(() => {
    if (!window.localStorage.getItem('trackflow_access_token')) {
      router.replace(localizedPath('/login', locale));
      return;
    }
  }, [locale, router]);

  return (
    <>
      <a className="skip-link" href="#inventory-content">{translate(locale, 'Ir a contenido principal')}</a>
      <OpsSectionShell section="inventory">
        <main className="main inventory-main" id="inventory-content">
          {children}
        </main>
      </OpsSectionShell>
    </>
  );
}
