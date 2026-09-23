import { NextResponse } from 'next/server';
import { removeNote } from '../../../../../../lib/records-store';

type RouteContext = { params: Promise<{ id: string; note_id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { id, note_id: noteId } = await context.params;
  return removeNote(id, noteId) ? new NextResponse(null, { status: 204 }) : NextResponse.json({ error: 'Nota no encontrada.' }, { status: 404 });
}