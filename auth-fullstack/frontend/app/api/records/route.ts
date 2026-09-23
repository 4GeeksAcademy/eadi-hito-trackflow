import { NextResponse } from 'next/server';
import { createRecord, getAllRecords } from '../../../lib/records-store';
import { validateCandidatePayload } from '../../../lib/validation';

export async function GET() {
  return NextResponse.json(getAllRecords());
}

export async function POST(request: Request) {
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