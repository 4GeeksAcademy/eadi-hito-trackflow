'use client';

import CandidateList from '../../components/CandidateList';
import { Suspense } from 'react';
import { useLocale } from '../../components/LocaleProvider';

export default function HomePage() {
  const isEnglish = useLocale() === 'en';
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl p-8 text-slate-600">{isEnglish ? 'Loading candidates…' : 'Cargando candidaturas...'}</div>}>
      <CandidateList />
    </Suspense>
  );
}
