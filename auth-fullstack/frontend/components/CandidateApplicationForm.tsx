'use client';

import { FormEvent, useState } from 'react';
import { useLocale } from './LocaleProvider';

const maxCvSize = 10 * 1024 * 1024;
const allowedCvExtensions = ['pdf', 'doc', 'docx'];
const spanishUploadErrors: Record<string, string> = {
  'Application could not be submitted. Please review the form and try again.': 'No se pudo enviar la candidatura. Revisa el formulario e inténtalo de nuevo.',
  'Application could not be submitted.': 'No se pudo enviar la candidatura.',
  'Unsupported CV file type.': 'Formato de archivo no permitido. Adjunta un PDF, DOC o DOCX.',
  'CV must be between 1 byte and 10 MB.': 'El CV debe tener un tamaño máximo de 10 MB.',
  'The uploaded CV does not match its file type.': 'El contenido del CV no coincide con el formato del archivo.',
};

export default function CandidateApplicationForm() {
  const isEnglish = useLocale() === 'en';
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedFileName, setSelectedFileName] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getFieldError(form: FormData, name: string) {
    const rawValue = form.get(name);
    const value = typeof rawValue === 'string' ? rawValue.trim() : '';
    if (name === 'name' && !value) return isEnglish ? 'Full name is required.' : 'El nombre completo es obligatorio.';
    if (name === 'email' && (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) return isEnglish ? 'Enter a valid email address.' : 'Ingresa un email válido.';
    if (name === 'phone' && !value) return isEnglish ? 'Phone is required.' : 'El teléfono es obligatorio.';
    if (name === 'position' && !value) return isEnglish ? 'Position is required.' : 'El puesto es obligatorio.';
    if (name === 'yearsOfExperience' && Number(value) < 0) return isEnglish ? 'Years of experience cannot be negative.' : 'Los años de experiencia no pueden ser negativos.';
    if (name === 'cv') {
      const file = rawValue;
      if (!(file instanceof File) || !file.size) return isEnglish ? 'Attach your resume.' : 'Adjunta tu CV.';
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedCvExtensions.includes(extension)) return isEnglish ? 'Upload a PDF, DOC, or DOCX file.' : 'Adjunta un archivo PDF, DOC o DOCX.';
      if (file.size > maxCvSize) return isEnglish ? 'The resume must be 10 MB or smaller.' : 'El CV no puede superar los 10 MB.';
    }
    return '';
  }

  function validateField(formElement: HTMLFormElement, name: string) {
    const message = getFieldError(new FormData(formElement), name);
    setErrors((current) => ({ ...current, [name]: message }));
    return !message;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const formData = new FormData(formElement);
    const fieldNames = ['name', 'email', 'phone', 'position', 'yearsOfExperience', 'cv'];
    const nextErrors = Object.fromEntries(fieldNames.map((name) => [name, getFieldError(formData, name)]));
    setErrors(nextErrors);
    const firstInvalid = fieldNames.find((name) => nextErrors[name]);
    if (firstInvalid) {
      formElement.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setSubmitError('');
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/records', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(isEnglish ? 'Application could not be submitted. Please review the form and try again.' : spanishUploadErrors['Application could not be submitted. Please review the form and try again.']);
      setSubmitted(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Application could not be submitted.';
      setSubmitError(isEnglish ? message : spanishUploadErrors[message] ?? 'No se pudo enviar la candidatura.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return <div className="success" role="status">
      <strong>{isEnglish ? 'Application received.' : 'Hemos recibido tu candidatura.'}</strong>
      <p>{isEnglish ? 'The recruiting team will review your profile.' : 'El equipo de RRHH revisará tu perfil.'}</p>
      <button className="button button-primary" type="button" onClick={() => { setErrors({}); setSelectedFileName(''); setSubmitted(false); }}>
        {isEnglish ? 'Submit another application' : 'Enviar otra candidatura'}
      </button>
    </div>;
  }

  return <form className="career-form" onSubmit={submit} noValidate onBlur={(event) => {
    const target = event.target;
    if ((target instanceof HTMLInputElement || target instanceof HTMLSelectElement) && target.name) validateField(event.currentTarget, target.name);
  }} onChange={(event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === 'cv') setSelectedFileName(target.files?.[0]?.name ?? '');
    if ((target instanceof HTMLInputElement || target instanceof HTMLSelectElement) && errors[target.name]) validateField(event.currentTarget, target.name);
  }}>
    <div className="form-grid">
      <div className="field"><label htmlFor="candidate-name">{isEnglish ? 'Full name *' : 'Nombre completo *'}</label><input id="candidate-name" name="name" autoComplete="name" required aria-invalid={Boolean(errors.name)} />{errors.name && <span className="form-message error">{errors.name}</span>}</div>
      <div className="field"><label htmlFor="candidate-email">{isEnglish ? 'Email *' : 'Email *'}</label><input id="candidate-email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} />{errors.email && <span className="form-message error">{errors.email}</span>}</div>
      <div className="field"><label htmlFor="candidate-phone">{isEnglish ? 'Phone *' : 'Teléfono *'}</label><input id="candidate-phone" name="phone" type="tel" autoComplete="tel" required aria-invalid={Boolean(errors.phone)} />{errors.phone && <span className="form-message error">{errors.phone}</span>}</div>
      <div className="field"><label htmlFor="candidate-position">{isEnglish ? 'Position of interest *' : 'Puesto de interés *'}</label><input id="candidate-position" name="position" required aria-invalid={Boolean(errors.position)} />{errors.position && <span className="form-message error">{errors.position}</span>}</div>
      <div className="field"><label htmlFor="candidate-linkedin">LinkedIn</label><input id="candidate-linkedin" name="linkedinUrl" type="url" placeholder="https://www.linkedin.com/in/" /></div>
      <div className="field"><label htmlFor="candidate-experience">{isEnglish ? 'Years of experience' : 'Años de experiencia'}</label><input id="candidate-experience" name="yearsOfExperience" type="number" min="0" defaultValue="0" aria-invalid={Boolean(errors.yearsOfExperience)} />{errors.yearsOfExperience && <span className="form-message error">{errors.yearsOfExperience}</span>}</div>
      <div className="field full"><label htmlFor="candidate-cv">{isEnglish ? 'Resume (PDF, DOC, or DOCX) *' : 'CV (PDF, DOC o DOCX) *'}</label><input id="candidate-cv" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" required aria-invalid={Boolean(errors.cv)} />{selectedFileName && <span className="form-message">{selectedFileName}</span>}{errors.cv && <span className="form-message error">{errors.cv}</span>}</div>
    </div>
    {submitError && <p className="form-message error" role="alert">{submitError}</p>}
    <button className="button button-primary" type="submit" disabled={isSubmitting} style={{ marginTop: 20 }}>
      {isSubmitting ? (isEnglish ? 'Submitting…' : 'Enviando…') : (isEnglish ? 'Submit application' : 'Enviar candidatura')}
    </button>
  </form>;
}