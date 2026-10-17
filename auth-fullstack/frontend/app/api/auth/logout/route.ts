import { NextResponse } from 'next/server';
import { sessionCookie } from '../../../../lib/auth-session';

export async function POST() {
  const response = new NextResponse(null, { status: 303, headers: { Location: '/login' } });
  response.cookies.delete(sessionCookie);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}