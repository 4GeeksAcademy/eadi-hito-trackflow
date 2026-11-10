'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  createNote,
  deleteNote,
  getRecordById,
  getRecordNotes,
  patchCandidateStage,
  patchCandidateStatus,
} from '../../../lib/api';
import { Candidate, CandidateStage, CandidateStatus, Note } from '../../../types/candidate';
import { useLocale } from '../../../components/LocaleProvider';
import { OpsSectionShell } from '../../../components/OpsSidebar';
import { candidateStageLabel, candidateStatusLabel } from '../../../lib/candidate-labels';
import { localizedPath } from '../../../lib/i18n';

const statusOptions: CandidateStatus[] = ['New', 'Reviewing', 'Interviewing', 'Offer', 'Hired', 'Rejected'];
const stageOptions: CandidateStage[] = ['Application', 'Screening', 'Interview', 'Final Round', 'Offer', 'Hired'];

export default function CandidateDetailPage() {
  const params = useParams<{ id?: string; segments?: string[] }>();
  const locale = useLocale();
  const isEnglish = locale === 'en';
  const candidateId = params.id ?? params.segments?.at(-1);
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteDraft, setNoteDraft] = useState('');

  useEffect(() => {
    if (!candidateId) return;
    let active = true;

    const loadCandidate = async () => {
      try {
        const data = await getRecordById(candidateId);
        const candidateNotes = await getRecordNotes(candidateId);
        if (active) {
          setCandidate(data);
          setNotes(candidateNotes);
        }
      } catch (fetchError) {
        if (active) setError(fetchError instanceof Error ? fetchError.message : isEnglish ? 'Could not load the candidate.' : 'Error al cargar la candidatura.');
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadCandidate();
    return () => { active = false; };
  }, [candidateId, isEnglish]);

  const handlePatchStatus = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!candidate) return;

    try {
      const updatedCandidate = await patchCandidateStatus(candidate.id, event.target.value as CandidateStatus);
      setCandidate(updatedCandidate);
    } catch (patchError) {
      setError(patchError instanceof Error ? patchError.message : isEnglish ? 'Could not update the status.' : 'No se pudo actualizar el estado.');
    }
  };

  const handlePatchStage = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (!candidate) return;

    try {
      const updatedCandidate = await patchCandidateStage(candidate.id, event.target.value as CandidateStage);
      setCandidate(updatedCandidate);
    } catch (patchError) {
      setError(patchError instanceof Error ? patchError.message : isEnglish ? 'Could not update the stage.' : 'No se pudo actualizar la etapa.');
    }
  };

  const handleAddNote = async () => {
    if (!candidate || !noteDraft.trim()) return;

    try {
      const newNote = await createNote(candidate.id, noteDraft.trim());
      setNotes((current) => [newNote, ...current]);
      setNoteDraft('');
    } catch (noteError) {
      setError(noteError instanceof Error ? noteError.message : isEnglish ? 'Could not add the note.' : 'No se pudo añadir la nota.');
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!candidate) return;

    try {
      await deleteNote(candidate.id, noteId);
      setNotes((current) => current.filter((note) => note.id !== noteId));
    } catch (noteError) {
      setError(noteError instanceof Error ? noteError.message : isEnglish ? 'Could not delete the note.' : 'No se pudo eliminar la nota.');
    }
  };

  if (loading) {
    return <OpsSectionShell section="candidates"><main className="main"><p className="text-slate-600">{isEnglish ? 'Loading candidate…' : 'Cargando candidatura...'}</p></main></OpsSectionShell>;
  }

  if (error || !candidate) {
    return (
      <OpsSectionShell section="candidates"><main className="main">
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">{error || (isEnglish ? 'Candidate not found.' : 'No se encontró la candidatura.')}</p>
        <Link href={localizedPath('/candidates', locale)} className="mt-4 inline-block rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">{isEnglish ? 'Back to list' : 'Volver al listado'}</Link>
      </main></OpsSectionShell>
    );
  }

  return (
    <OpsSectionShell section="candidates"><main className="main mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">TrackFlow</p>
          <h1 className="mt-2 text-3xl font-bold">{candidate.name}</h1>
        </div>
        <Link href={localizedPath('/candidates', locale)} className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-900">{isEnglish ? 'Back to list' : 'Volver'}</Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{isEnglish ? 'Candidate details' : 'Datos principales'}</h2>

            <dl className="mt-4 grid gap-4 text-sm text-slate-700 sm:grid-cols-2">
              <div><dt className="font-medium text-slate-500">{isEnglish ? 'Name' : 'Nombre'}</dt><dd>{candidate.name}</dd></div>
              <div><dt className="font-medium text-slate-500">Email</dt><dd>{candidate.email}</dd></div>
              <div><dt className="font-medium text-slate-500">{isEnglish ? 'Phone' : 'Teléfono'}</dt><dd>{candidate.phone}</dd></div>
              <div><dt className="font-medium text-slate-500">{isEnglish ? 'Position' : 'Puesto'}</dt><dd>{candidate.position}</dd></div>
              <div><dt className="font-medium text-slate-500">LinkedIn</dt><dd><a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" className="text-emerald-600 underline">{isEnglish ? 'View profile' : 'Ver perfil'}</a></dd></div>
              <div><dt className="font-medium text-slate-500">{isEnglish ? 'Resume' : 'CV'}</dt><dd><a href={candidate.cvUrl} target="_blank" rel="noreferrer" className="text-emerald-600 underline">{isEnglish ? 'Open resume' : 'Abrir CV'}</a></dd></div>
              <div><dt className="font-medium text-slate-500">{isEnglish ? 'Years of experience' : 'Años de experiencia'}</dt><dd>{candidate.yearsOfExperience}</dd></div>
              <div><dt className="font-medium text-slate-500">{isEnglish ? 'Applied' : 'Fecha de aplicación'}</dt><dd>{new Date(candidate.appliedAt).toLocaleDateString(isEnglish ? 'en-US' : 'es-ES')}</dd></div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{isEnglish ? 'Notes' : 'Notas'}</h2>
            <div className="mt-4 flex gap-3">
              <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} placeholder={isEnglish ? 'Write a note…' : 'Escribe una nota...'} className="min-h-24 flex-1 rounded-xl border border-slate-300 px-3 py-2" />
              <button onClick={handleAddNote} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">{isEnglish ? 'Add note' : 'Añadir nota'}</button>
            </div>

            <div className="mt-5 space-y-3">
              {notes.length === 0 ? (
                <p className="text-sm text-slate-500">{isEnglish ? 'No notes yet.' : 'No hay notas todavía.'}</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-slate-700">{note.content}</p>
                      <button onClick={() => handleDeleteNote(note.id)} className="text-xs font-medium text-red-600">{isEnglish ? 'Delete' : 'Eliminar'}</button>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{new Date(note.createdAt).toLocaleString(isEnglish ? 'en-US' : 'es-ES')}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">{isEnglish ? 'Status and stage' : 'Estado y etapa'}</h2>

            <div className="mt-4 space-y-4">
              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>{isEnglish ? 'Current status' : 'Estado actual'}</span>
                <select value={candidate.status} onChange={handlePatchStatus} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{candidateStatusLabel(status, locale)}</option>
                  ))}
                </select>
              </label>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                <span>{isEnglish ? 'Current stage' : 'Etapa actual'}</span>
                <select value={candidate.stage} onChange={handlePatchStage} className="w-full rounded-xl border border-slate-300 px-3 py-2">
                  {stageOptions.map((stage) => (
                    <option key={stage} value={stage}>{candidateStageLabel(stage, locale)}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

        </aside>
      </section>
    </main></OpsSectionShell>
  );
}
