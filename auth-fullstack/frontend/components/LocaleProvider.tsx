'use client';

import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { Locale } from '../lib/i18n';

const LocaleContext = createContext<Locale>('es');

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale: Locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'es';

  useEffect(() => {
    document.documentElement.lang = locale;
    if (locale === 'en') {
      document.title = 'TrackFlow | Logistics that scales with your e-commerce';
      document.querySelector('meta[name="description"]')?.setAttribute('content', 'Warehousing, last-mile delivery, and reverse logistics in the United States and Spain.');
    }
  }, [locale]);

  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}