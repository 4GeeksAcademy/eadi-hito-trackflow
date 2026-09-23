'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error('request-failed');
      setSent(true);
    } catch {
      setError('No se pudo enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">TrackFlow Ops</p><h1>Recuperar contraseña</h1>{sent ? <><p role="status">Si esa dirección está registrada, recibirás un enlace en breve.</p><Link href="/login">Volver a iniciar sesión</Link></> : <form onSubmit={submit}><label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>{error && <p className="incident-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Enviando…' : 'Enviar enlace'}</button></form>}</section></main>;
}
