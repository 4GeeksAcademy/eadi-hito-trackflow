export type CandidateStatus = 'New' | 'Reviewing' | 'Interviewing' | 'Offer' | 'Hired' | 'Rejected';
export type CandidateStage = 'Application' | 'Screening' | 'Interview' | 'Final Round' | 'Offer' | 'Hired';

export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  linkedinUrl: string;
  cvUrl: string;
  yearsOfExperience: number;
  status: CandidateStatus;
  stage: CandidateStage;
  appliedAt: string;
  notes: Note[];
}

export interface CandidateFormValues {
  name: string;
  email: string;
  phone: string;
  position: string;
  linkedinUrl: string;
  cvUrl: string;
  yearsOfExperience: number;
  status: CandidateStatus;
  stage: CandidateStage;
  appliedAt: string;
}

export interface CandidateQueryState {
  status: string;
  stage: string;
  search: string;
}
