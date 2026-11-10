import { NextResponse } from 'next/server';
import { getRecord } from '../../../../../lib/records-store';
import { readCandidateCv } from '../../../../../lib/candidate-cv-storage';

type RouteContext = { params: Promise<{ id: string }> };

export const runtime = 'nodejs';

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
  const candidate = getRecord(id);
  if (!candidate?.cvFileName || candidate.cvUrl !== `/api/records/${id}/cv`) {
    return NextResponse.json({ error: 'CV no encontrado.' }, { status: 404 });
  }

  const cv = await readCandidateCv(id, candidate.cvFileName);
  if (!cv) return NextResponse.json({ error: 'CV no encontrado.' }, { status: 404 });

  return new NextResponse(new Uint8Array(cv.contents), {
    headers: {
      'Cache-Control': 'private, no-store',
      'Content-Disposition': `attachment; filename="${cv.fileName}"`,
      'Content-Type': cv.contentType,
      'X-Content-Type-Options': 'nosniff',
    },
  });
}