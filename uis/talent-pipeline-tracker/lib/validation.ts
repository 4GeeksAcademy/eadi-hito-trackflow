import { CandidateFormValues, CandidateStage, CandidateStatus } from '../types/candidate';

const statuses: CandidateStatus[] = ['New', 'Reviewing', 'Interviewing', 'Offer', 'Hired', 'Rejected'];
const stages: CandidateStage[] = ['Application', 'Screening', 'Interview', 'Final Round', 'Offer', 'Hired'];

export function validateCandidatePayload(payload: unknown): { valid: boolean; value?: CandidateFormValues; error?: string } {
  if (!payload || typeof payload !== 'object') return { valid: false, error: 'El cuerpo de la petición no es válido.' };
  const value = payload as Partial<CandidateFormValues>;
  if (typeof value.name !== 'string' || !value.name.trim()) return { valid: false, error: 'El nombre es obligatorio.' };
  if (typeof value.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) return { valid: false, error: 'El email no es válido.' };
  if (typeof value.phone !== 'string' || !value.phone.trim()) return { valid: false, error: 'El teléfono es obligatorio.' };
  if (typeof value.position !== 'string' || !value.position.trim()) return { valid: false, error: 'El puesto es obligatorio.' };
  if (typeof value.linkedinUrl !== 'string' || typeof value.cvUrl !== 'string' || typeof value.appliedAt !== 'string') return { valid: false, error: 'Faltan campos de la candidatura.' };
  if (typeof value.yearsOfExperience !== 'number' || value.yearsOfExperience < 0) return { valid: false, error: 'Los años de experiencia no son válidos.' };
  if (!statuses.includes(value.status as CandidateStatus) || !stages.includes(value.stage as CandidateStage)) return { valid: false, error: 'El estado o la etapa no son válidos.' };
  return { valid: true, value: value as CandidateFormValues };
}