'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (password !== confirmation) {
      setError('Las contraseñas nuevas no coinciden.');
      return;
    }
    const token = localStorage.getItem('trackflow_access_token');
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token ?? ''}` }, body: JSON.stringify({ current_password: currentPassword, new_password: password }) });
      if (!response.ok) {
        setError(response.status === 400 ? 'La contraseña actual es incorrecta.' : 'Tu sesión no es válida. Vuelve a iniciar sesión.');
        return;
      }
      setMessage('Contraseña actualizada correctamente.');
      setCurrentPassword('');
      setPassword('');
      setConfirmation('');
    } catch {
      setError('No se pudo conectar con el servicio. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><p className="eyebrow">TrackFlow Ops</p><h1>Cambiar contraseña</h1><form onSubmit={submit}><label>Contraseña actual<input type="password" required value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></label><label>Nueva contraseña<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label><label>Confirmar contraseña<input type="password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{error && <p className="incident-error" role="alert">{error}</p>}{message && <p className="success-message" role="status">{message}</p>}<button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Actualizando…' : 'Actualizar contraseña'}</button></form><Link href="/">Volver al resumen</Link></section></main>;
}
