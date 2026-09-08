import { NextResponse } from 'next/server';
import { addNote, getNotes } from '../../../../../lib/records-store';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const notes = getNotes(id);
  return notes ? NextResponse.json(notes) : NextResponse.json({ error: 'Candidatura no encontrada.' }, { status: 404 });
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const payload = await request.json() as { content?: string };
  const note = payload.content?.trim() ? addNote(id, payload.content.trim()) : undefined;
  return note ? NextResponse.json(note, { status: 201 }) : NextResponse.json({ error: 'La nota no puede estar vacía.' }, { status: 400 });
}