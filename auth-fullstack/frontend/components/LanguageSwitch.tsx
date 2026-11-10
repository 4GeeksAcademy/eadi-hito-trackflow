'use client';

import Link from 'next/link';
import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function LanguageSwitch() {
  return <Suspense fallback={<span className="language-switch" aria-hidden="true">EN</span>}><LanguageSwitchLink /></Suspense>;
}

function LanguageSwitchLink() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const isEnglish = pathname === '/en' || pathname.startsWith('/en/');
  const spanishPath = isEnglish ? pathname.slice(3) || '/' : pathname;
  const englishPath = isEnglish ? pathname : `/en${pathname === '/' ? '' : pathname}`;
  const targetPath = isEnglish ? spanishPath : englishPath;

  return (
    <Link
      className="language-switch"
      href={`${targetPath}${search ? `?${search}` : ''}`}
      hrefLang={isEnglish ? 'es' : 'en'}
      lang={isEnglish ? 'es' : 'en'}
      aria-label={isEnglish ? 'Cambiar idioma a español' : 'Switch language to English'}
      title={isEnglish ? 'Español' : 'English'}
    >
      {isEnglish ? 'ES' : 'EN'}
    </Link>
  );
}