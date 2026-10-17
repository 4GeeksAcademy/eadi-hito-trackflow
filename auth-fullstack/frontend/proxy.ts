import { NextRequest, NextResponse } from 'next/server';
import { sessionCookie, validateSession } from './lib/auth-session';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/api/records' && request.method === 'POST') {
    return NextResponse.next();
  }

  const token = request.cookies.get(sessionCookie)?.value;
  let valid = false;
  try {
    valid = !!token && await validateSession(token);
  } catch {
    return NextResponse.json({ error: 'El servicio de autenticación no está disponible.' }, { status: 503 });
  }

  if (!valid) {
    const login = new URL('/login', request.url);
    login.searchParams.set('next', pathname + request.nextUrl.search);
    const response = pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Debes iniciar sesión.' }, { status: 401 })
      : NextResponse.redirect(login);
    response.cookies.delete(sessionCookie);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  }

  const headers = new Headers(request.headers);
  if (pathname.startsWith('/api/')) headers.set('Authorization', `Bearer ${token}`);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

export const config = {
  matcher: [
    '/ops/:path*', '/inventory/:path*', '/incidents/:path*',
    '/suppliers/:path*', '/candidates/:path*', '/account/:path*',
    '/api/records/:path*', '/api/inventory/:path*', '/api/incidents/:path*',
    '/api/suppliers/:path*',
  ],
};