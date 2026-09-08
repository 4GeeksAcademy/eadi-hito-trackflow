'use client';

import CandidateList from '../components/CandidateList';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl p-8 text-slate-600">Cargando candidaturas...</div>}>
      <CandidateList />
    </Suspense>
  );
}
