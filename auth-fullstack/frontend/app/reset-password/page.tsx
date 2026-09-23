'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (password !== confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, new_password: password }) });
      if (!response.ok) {
        setError('El enlace es inválido, ha caducado o ya fue utilizado. Solicita otro enlace e inténtalo de nuevo.');
        return;
      }
      router.push('/login?reset=success');
    } catch {
      setError('No se pudo conectar con el servicio. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">TrackFlow Ops</p><h1>Nueva contraseña</h1>{!token && <p className="incident-error" role="alert">Falta el token de restablecimiento.</p>}<form onSubmit={submit}><label>Nueva contraseña<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label><label>Confirmar contraseña<input type="password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{error && <p className="incident-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={!token || submitting}>{submitting ? 'Guardando…' : 'Guardar contraseña'}</button></form><Link href="/forgot-password">Solicitar otro enlace</Link></section></main>;
}
