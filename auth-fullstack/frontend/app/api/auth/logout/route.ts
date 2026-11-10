import { NextResponse } from 'next/server';
import { sessionCookie } from '../../../../lib/auth-session';

export async function POST(request: Request) {
  const locale = new URL(request.url).searchParams.get('locale') === 'en' ? '/en' : '';
  const response = new NextResponse(null, { status: 303, headers: { Location: `${locale}/login` } });
  response.cookies.delete(sessionCookie);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}