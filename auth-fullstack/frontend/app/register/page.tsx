'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirmation: '', name: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (form.password !== form.confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, name: form.name }),
      });
      if (!response.ok) {
        setError(response.status === 409 ? 'Ya existe una cuenta con ese email.' : response.status >= 500 ? 'El servicio no está disponible. Inténtalo de nuevo.' : 'No se pudo crear la cuenta. Revisa los datos.');
        return;
      }
      router.push('/login?registered=success');
    } catch {
      setError('No se pudo conectar con el servicio. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">TrackFlow Ops</p><h1>Crear cuenta</h1><form onSubmit={submit}><label>Nombre<input required value={form.name} onChange={(event) => update('name', event.target.value)} /></label><label>Email<input type="email" required value={form.email} onChange={(event) => update('email', event.target.value)} /></label><label>Contraseña<input type="password" required minLength={8} value={form.password} onChange={(event) => update('password', event.target.value)} /></label><label>Confirmar contraseña<input type="password" required minLength={8} value={form.confirmation} onChange={(event) => update('confirmation', event.target.value)} /></label>{error && <p className="incident-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Creando…' : 'Crear cuenta'}</button></form><Link href="/login">Ya tengo una cuenta</Link></section></main>;
}
