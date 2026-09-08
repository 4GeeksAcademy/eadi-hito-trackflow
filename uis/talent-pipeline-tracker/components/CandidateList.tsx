'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { Candidate, CandidateStage, CandidateStatus } from '../types/candidate';
import { createCandidate, getRecords } from '../lib/api';
import CandidateForm from './CandidateForm';

const statusOptions: Array<'all' | CandidateStatus> = ['all', 'New', 'Reviewing', 'Interviewing', 'Offer', 'Hired', 'Rejected'];
const stageOptions: Array<'all' | CandidateStage> = ['all', 'Application', 'Screening', 'Interview', 'Final Round', 'Offer', 'Hired'];

export default function CandidateList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [records, setRecords] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const status = searchParams.get('status') ?? 'all';
  const stage = searchParams.get('stage') ?? 'all';
  const searchQuery = searchParams.get('search') ?? '';

  useEffect(() => {
    let active = true;

    const loadRecords = async () => {
      try {
        const data = await getRecords();
        if (active) setRecords(data);
      } catch (fetchError) {
        if (active) setError(fetchError instanceof Error ? fetchError.message : 'No se pudieron cargar las candidaturas.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadRecords();
    return () => { active = false; };
  }, []);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const queryString = params.toString();
    router.replace(queryString ? `/?${queryString}` : '/');
  };

  const filteredRecords = useMemo(() => {
    return records.filter((candidate) => {
      const matchesStatus = status === 'all' || candidate.status === status;
      const matchesStage = stage === 'all' || candidate.stage === stage;
      const searchValue = searchQuery.trim().toLowerCase();
      const matchesSearch = !searchValue || candidate.name.toLowerCase().includes(searchValue) || candidate.email.toLowerCase().includes(searchValue);

      return matchesStatus && matchesStage && matchesSearch;
    });
  }, [records, status, stage, searchQuery]);

  const handleCreateCandidate = async (values: Parameters<typeof createCandidate>[0]) => {
    const newCandidate = await createCandidate(values);
    setRecords((current) => [newCandidate, ...current]);
    setShowForm(false);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">TrackFlow</p>
          <h1 className="mt-2 text-3xl font-bold">Talent Pipeline Tracker</h1>
        </div>
        <button onClick={() => setShowForm((current) => !current)} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-400">
          {showForm ? 'Cerrar formulario' : 'Nueva candidatura'}
        </button>
      </header>

      {showForm ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <CandidateForm
            mode="create"
            initialValues={{
              name: '',
              email: '',
              phone: '',
              position: '',
              linkedinUrl: '',
              cvUrl: '',
              yearsOfExperience: 0,
              status: 'New',
              stage: 'Application',
              appliedAt: new Date().toISOString().slice(0, 10),
            }}
            submitLabel="Crear candidatura"
            onSubmit={handleCreateCandidate}
          />
        </div>
      ) : null}

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_2fr]">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Estado</span>
          <select value={status} onChange={(event) => updateParam('status', event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2">
            {statusOptions.map((item) => (
              <option key={item} value={item}>{item === 'all' ? 'Todos' : item}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Etapa</span>
          <select value={stage} onChange={(event) => updateParam('stage', event.target.value)} className="w-full rounded-xl border border-slate-300 px-3 py-2">
            {stageOptions.map((item) => (
              <option key={item} value={item}>{item === 'all' ? 'Todas' : item}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Buscar</span>
          <input value={searchQuery} onChange={(event) => updateParam('search', event.target.value)} placeholder="Nombre o email" className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>
      </section>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 animate-pulse rounded-2xl bg-slate-200" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error}</div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-600">
          No hay candidaturas que coincidan con los filtros actuales.
        </div>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredRecords.map((candidate) => (
            <Link key={candidate.id} href={`/candidates/${candidate.id}`} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">{candidate.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{candidate.position}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">{candidate.status}</span>
              </div>

              <dl className="mt-4 space-y-2 text-sm text-slate-600">
                <div className="flex justify-between gap-2"><dt>Etapa</dt><dd>{candidate.stage}</dd></div>
                <div className="flex justify-between gap-2"><dt>Email</dt><dd className="truncate">{candidate.email}</dd></div>
                <div className="flex justify-between gap-2"><dt>Aplicación</dt><dd>{new Date(candidate.appliedAt).toLocaleDateString('es-ES')}</dd></div>
              </dl>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
