export const sessionCookie = 'trackflow_access_token';

export const backendUrl = (process.env.BACKEND_URL ?? (
  process.env.CODESPACES === 'true' && process.env.BACKEND_HOST_PORT
    ? `http://host.docker.internal:${process.env.BACKEND_HOST_PORT ?? '8001'}`
    : 'http://127.0.0.1:8000'
)).replace(/\/$/, '');

export async function validateSession(token: string): Promise<boolean> {
  const response = await fetch(`${backendUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  return response.ok;
}