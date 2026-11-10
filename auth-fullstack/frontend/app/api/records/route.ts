import { NextResponse } from 'next/server';
import { createRecord, getAllRecords } from '../../../lib/records-store';
import { validateCandidatePayload } from '../../../lib/validation';
import { CandidateCvValidationError, createCandidateId, MAX_CANDIDATE_CV_BYTES, saveCandidateCv } from '../../../lib/candidate-cv-storage';

export const runtime = 'nodejs';

function formText(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

export async function GET() {
  return NextResponse.json(getAllRecords());
}

export async function POST(request: Request) {
  if (request.headers.get('content-type')?.toLowerCase().includes('multipart/form-data')) {
    const contentLength = Number(request.headers.get('content-length'));
    if (contentLength > MAX_CANDIDATE_CV_BYTES + 64 * 1024) {
      return NextResponse.json({ error: 'El archivo supera el límite permitido de 10 MB.' }, { status: 413 });
    }

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json({ error: 'El formulario de candidatura no es válido.' }, { status: 400 });
    }

    const file = form.get('cv');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Debes adjuntar un CV en PDF, DOC o DOCX.' }, { status: 400 });
    }

    const candidateId = createCandidateId();
    const payload = {
      name: formText(form, 'name'),
      email: formText(form, 'email'),
      phone: formText(form, 'phone'),
      position: formText(form, 'position'),
      linkedinUrl: formText(form, 'linkedinUrl'),
      cvUrl: `/api/records/${candidateId}/cv`,
      yearsOfExperience: Number(formText(form, 'yearsOfExperience') || 0),
      status: 'New',
      stage: 'Application',
      appliedAt: new Date().toISOString().slice(0, 10),
    };
    const result = validateCandidatePayload(payload);
    if (!result.valid || !result.value) return NextResponse.json({ error: result.error }, { status: 400 });

    try {
      const { fileName } = await saveCandidateCv(candidateId, file);
      return NextResponse.json(createRecord(result.value, candidateId, fileName), { status: 201 });
    } catch (uploadError) {
      if (uploadError instanceof CandidateCvValidationError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
      }
      return NextResponse.json({ error: 'No se pudo guardar el CV. Inténtalo de nuevo.' }, { status: 500 });
    }
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'El cuerpo de la petición no es un JSON válido.' }, { status: 400 });
  }
  const result = validateCandidatePayload(payload);
  if (!result.valid || !result.value) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(createRecord(result.value), { status: 201 });
}