import { NextRequest, NextResponse } from 'next/server';
import { sessionCookie, validateSession } from '../../../../lib/auth-session';

export async function GET(request: NextRequest) {
  const token = request.cookies.get(sessionCookie)?.value;
  try {
    if (token && await validateSession(token)) {
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
      return NextResponse.json({ expiresAt: payload.exp * 1000 }, { headers: { 'Cache-Control': 'no-store' } });
    }
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible.' }, { status: 503 });
  }
  const response = NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 });
  response.cookies.delete(sessionCookie);
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '');
  try {
    if (token && await validateSession(token)) {
      const response = NextResponse.json({ authenticated: true });
      response.cookies.set(sessionCookie, token, {
        httpOnly: true,
        secure: request.nextUrl.protocol === 'https:',
        sameSite: 'lax',
        path: '/',
      });
      response.headers.set('Cache-Control', 'no-store');
      return response;
    }
    return NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible.' }, { status: 503 });
  }
}