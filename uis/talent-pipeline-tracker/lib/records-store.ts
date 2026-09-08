import { initialCandidates } from './mock-data';
import { Candidate, CandidateFormValues, CandidateStage, CandidateStatus, Note } from '../types/candidate';

let records: Candidate[] = initialCandidates.map((candidate) => ({
  ...candidate,
  notes: candidate.notes.map((note) => ({ ...note })),
}));

export function cloneCandidate(candidate: Candidate): Candidate {
  return { ...candidate, notes: candidate.notes.map((note) => ({ ...note })) };
}

export function getAllRecords(): Candidate[] { return records.map(cloneCandidate); }

export function getRecord(id: string): Candidate | undefined {
  const candidate = records.find((record) => record.id === id);
  return candidate ? cloneCandidate(candidate) : undefined;
}

export function createRecord(payload: CandidateFormValues): Candidate {
  const candidate: Candidate = { id: `cand-${Date.now()}`, ...payload, notes: [] };
  records = [candidate, ...records];
  return cloneCandidate(candidate);
}

export function updateRecord(id: string, payload: CandidateFormValues): Candidate | undefined {
  const index = records.findIndex((record) => record.id === id);
  if (index === -1) return undefined;
  records[index] = { ...records[index], ...payload };
  return cloneCandidate(records[index]);
}

export function patchStatus(id: string, status: CandidateStatus): Candidate | undefined {
  const candidate = records.find((record) => record.id === id);
  if (!candidate) return undefined;
  candidate.status = status;
  return cloneCandidate(candidate);
}

export function patchStage(id: string, stage: CandidateStage): Candidate | undefined {
  const candidate = records.find((record) => record.id === id);
  if (!candidate) return undefined;
  candidate.stage = stage;
  return cloneCandidate(candidate);
}

export function getNotes(id: string): Note[] | undefined {
  const candidate = records.find((record) => record.id === id);
  return candidate?.notes.map((note) => ({ ...note }));
}

export function addNote(id: string, content: string): Note | undefined {
  const candidate = records.find((record) => record.id === id);
  if (!candidate) return undefined;
  const note: Note = { id: `note-${Date.now()}`, content, createdAt: new Date().toISOString() };
  candidate.notes = [note, ...candidate.notes];
  return { ...note };
}

export function removeNote(id: string, noteId: string): boolean {
  const candidate = records.find((record) => record.id === id);
  if (!candidate) return false;
  const originalLength = candidate.notes.length;
  candidate.notes = candidate.notes.filter((note) => note.id !== noteId);
  return candidate.notes.length !== originalLength;
}