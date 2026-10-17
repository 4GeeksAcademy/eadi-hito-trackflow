import { NextRequest, NextResponse } from 'next/server';
import { backendUrl, sessionCookie } from '../../../../lib/auth-session';

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${backendUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: await request.text(),
      cache: 'no-store',
    });
    const data = await response.json();
    const result = NextResponse.json(data, { status: response.status });
    if (response.ok && typeof data.access_token === 'string') {
      result.cookies.set(sessionCookie, data.access_token, {
        httpOnly: true,
        secure: request.nextUrl.protocol === 'https:',
        sameSite: 'lax',
        path: '/',
      });
    }
    result.headers.set('Cache-Control', 'no-store');
    return result;
  } catch {
    return NextResponse.json({ detail: 'El servicio no está disponible.' }, { status: 503 });
  }
}