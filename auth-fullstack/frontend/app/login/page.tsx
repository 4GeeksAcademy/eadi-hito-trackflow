'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (!response.ok) {
        setError(response.status >= 500 ? 'El servicio no está disponible. Inténtalo de nuevo.' : 'El email o la contraseña no son correctos.');
        return;
      }
      const data = await response.json() as { access_token?: string };
      if (!data.access_token) {
        setError('La respuesta del servicio no es válida. Inténtalo de nuevo.');
        return;
      }
      localStorage.setItem('trackflow_access_token', data.access_token);
      router.push('/');
    } catch {
      setError('No se pudo conectar con el servicio. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">TrackFlow Ops</p><h1>Iniciar sesión</h1><form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Contraseña<input type="password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>{error && <p className="incident-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Accediendo…' : 'Entrar'}</button></form><Link href="/forgot-password">¿Olvidaste tu contraseña?</Link><br /><Link href="/register">Crear una cuenta</Link></section></main>;
}
