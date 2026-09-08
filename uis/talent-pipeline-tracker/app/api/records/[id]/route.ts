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
  const result = validateCandidatePayload(await request.json());
  if (!result.valid || !result.value) return NextResponse.json({ error: result.error }, { status: 400 });
  const candidate = updateRecord(id, result.value);
  return candidate ? NextResponse.json(candidate) : NextResponse.json({ error: 'Candidatura no encontrada.' }, { status: 404 });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = await request.json() as { status?: CandidateStatus; stage?: CandidateStage };
  const candidate = payload.status ? patchStatus(id, payload.status) : payload.stage ? patchStage(id, payload.stage) : undefined;
  return candidate ? NextResponse.json(candidate) : NextResponse.json({ error: 'La actualización no es válida.' }, { status: 400 });
}