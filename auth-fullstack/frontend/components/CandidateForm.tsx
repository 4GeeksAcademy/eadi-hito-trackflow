'use client';

import { FormEvent, useState } from 'react';
import { CandidateFormValues, CandidateStage, CandidateStatus } from '../types/candidate';

interface CandidateFormProps {
  mode: 'create' | 'edit';
  initialValues: CandidateFormValues;
  onSubmit: (values: CandidateFormValues) => Promise<void>;
  submitLabel: string;
  onCancel?: () => void;
}

const statusOptions: CandidateStatus[] = ['New', 'Reviewing', 'Interviewing', 'Offer', 'Hired', 'Rejected'];
const stageOptions: CandidateStage[] = ['Application', 'Screening', 'Interview', 'Final Round', 'Offer', 'Hired'];

const emptyForm: CandidateFormValues = {
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
};

export default function CandidateForm({ mode, initialValues, onSubmit, submitLabel, onCancel }: CandidateFormProps) {
  const [values, setValues] = useState<CandidateFormValues>(initialValues || emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    setValues((current) => ({
      ...current,
      [name]: name === 'yearsOfExperience' ? Number(value) : value,
    }));
  };

  const validate = (): string => {
    if (!values.name.trim()) return 'El nombre es obligatorio.';
    if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) return 'El email debe tener un formato válido.';
    if (!values.phone.trim()) return 'El teléfono es obligatorio.';
    if (!values.position.trim()) return 'El puesto es obligatorio.';
    if (values.yearsOfExperience < 0) return 'Los años de experiencia no pueden ser negativos.';
    return '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationError = validate();

    if (validationError) {
      setSuccess('');
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await onSubmit(values);
      setSuccess(mode === 'create' ? 'Candidatura creada correctamente.' : 'Candidatura actualizada correctamente.');
      if (mode === 'create') {
        setValues(emptyForm);
      }
    } catch (submitError) {
      setSuccess('');
      setError(submitError instanceof Error ? submitError.message : 'No se pudo enviar la candidatura.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Nombre completo</span>
          <input name="name" value={values.name} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none ring-0 transition focus:border-emerald-500" required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Email</span>
          <input name="email" type="email" value={values.email} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500" required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Teléfono</span>
          <input name="phone" value={values.phone} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500" required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Puesto</span>
          <input name="position" value={values.position} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500" required />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>LinkedIn</span>
          <input name="linkedinUrl" value={values.linkedinUrl} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500" />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Enlace al CV</span>
          <input name="cvUrl" value={values.cvUrl} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500" />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Años de experiencia</span>
          <input name="yearsOfExperience" type="number" min="0" value={values.yearsOfExperience} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500" />
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Estado</span>
          <select name="status" value={values.status} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500">
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700">
          <span>Etapa</span>
          <select name="stage" value={values.stage} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500">
            {stageOptions.map((stage) => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
          <span>Fecha de aplicación</span>
          <input name="appliedAt" type="date" value={values.appliedAt} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-emerald-500" required />
        </label>
      </div>

      {error ? <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p> : null}

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSubmitting} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-400">
          {isSubmitting ? 'Guardando...' : submitLabel}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  );
}
