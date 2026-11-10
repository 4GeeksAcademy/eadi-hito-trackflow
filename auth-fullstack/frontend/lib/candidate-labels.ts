import type { CandidateStage, CandidateStatus } from '../types/candidate';
import type { Locale } from './i18n';

const statusLabels: Record<CandidateStatus, string> = {
  New: 'Nueva',
  Reviewing: 'En revisión',
  Interviewing: 'En entrevistas',
  Offer: 'Oferta',
  Hired: 'Contratada',
  Rejected: 'No seleccionada',
};

const stageLabels: Record<CandidateStage, string> = {
  Application: 'Recibida',
  Screening: 'Preselección',
  Interview: 'Entrevista',
  'Final Round': 'Ronda final',
  Offer: 'Oferta',
  Hired: 'Incorporación',
};

export function candidateStatusLabel(status: CandidateStatus, locale: Locale) {
  return locale === 'en' ? status : statusLabels[status];
}

export function candidateStageLabel(stage: CandidateStage, locale: Locale) {
  return locale === 'en' ? stage : stageLabels[stage];
}