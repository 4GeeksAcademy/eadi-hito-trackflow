import { Candidate, CandidateFormValues, CandidateStage, CandidateStatus, Note } from '../types/candidate';

const apiRequest = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? 'La petición no se pudo completar.');
  }

  return response.status === 204 ? (undefined as T) : response.json() as Promise<T>;
};

export async function getRecords(): Promise<Candidate[]> {
  return apiRequest<Candidate[]>('/records');
}

export async function getRecordById(id: string): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`);
}

export async function getRecordNotes(id: string): Promise<Note[]> {
  return apiRequest<Note[]>(`/records/${id}/notes`);
}

export async function patchCandidateStatus(id: string, status: CandidateStatus): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) });
}

export async function patchCandidateStage(id: string, stage: CandidateStage): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`, { method: 'PATCH', body: JSON.stringify({ stage }) });
}

export async function createNote(id: string, content: string): Promise<Note> {
  return apiRequest<Note>(`/records/${id}/notes`, { method: 'POST', body: JSON.stringify({ content }) });
}

export async function deleteNote(id: string, noteId: string): Promise<void> {
  await apiRequest<void>(`/records/${id}/notes/${noteId}`, { method: 'DELETE' });
}

export async function createCandidate(payload: CandidateFormValues): Promise<Candidate> {
  return apiRequest<Candidate>('/records', { method: 'POST', body: JSON.stringify(payload) });
}

export async function updateCandidate(id: string, payload: CandidateFormValues): Promise<Candidate> {
  return apiRequest<Candidate>(`/records/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
}
