import { NextResponse } from 'next/server';
import { getRecord, patchStage, patchStatus, updateRecord } from '../../../../lib/records-store';
import { validateCandidatePayload } from '../../../../lib/validation';
import { CandidateStage, CandidateStatus } from '../../../../types/candidate';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const candidate = getRecord(id);
  return candidate ? NextResponse.json(candidate) : NextResponse.json({ error: 'Candidatura no encontrada.' }, { status: 404 });
}

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'El cuerpo de la petición no es un JSON válido.' }, { status: 400 });
  }
  const result = validateCandidatePayload(payload);
  if (!result.valid || !result.value) return NextResponse.json({ error: result.error }, { status: 400 });
  const candidate = updateRecord(id, result.value);
  return candidate ? NextResponse.json(candidate) : NextResponse.json({ error: 'Candidatura no encontrada.' }, { status: 404 });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let payload: { status?: CandidateStatus; stage?: CandidateStage };
  try {
    payload = await request.json() as { status?: CandidateStatus; stage?: CandidateStage };
  } catch {
    return NextResponse.json({ error: 'El cuerpo de la petición no es un JSON válido.' }, { status: 400 });
  }
  const validStatuses: CandidateStatus[] = ['New', 'Reviewing', 'Interviewing', 'Offer', 'Hired', 'Rejected'];
  const validStages: CandidateStage[] = ['Application', 'Screening', 'Interview', 'Final Round', 'Offer', 'Hired'];
  if ((payload.status && !validStatuses.includes(payload.status)) || (payload.stage && !validStages.includes(payload.stage))) {
    return NextResponse.json({ error: 'El estado o la etapa no son válidos.' }, { status: 400 });
  }
  const candidate = payload.status ? patchStatus(id, payload.status) : payload.stage ? patchStage(id, payload.stage) : undefined;
  return candidate ? NextResponse.json(candidate) : NextResponse.json({ error: 'La actualización no es válida.' }, { status: 400 });
}