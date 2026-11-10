'use client';

import Link from 'next/link';
import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LanguageSwitch from '../../components/LanguageSwitch';
import { useLocale } from '../../components/LocaleProvider';
import { localizedPath, translate } from '../../lib/i18n';

function ResetPasswordForm() {
  const locale = useLocale();
  const t = (text: string) => translate(locale, text);
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
      setError(t('Las contraseñas no coinciden.'));
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, new_password: password }) });
      if (!response.ok) {
        setError(t('El enlace es inválido, ha caducado o ya fue utilizado. Solicita otro enlace e inténtalo de nuevo.'));
        return;
      }
      router.push(`${localizedPath('/login', locale)}?reset=success`);
    } catch {
      setError(t('No se pudo conectar con el servicio. Inténtalo de nuevo.'));
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="auth-page"><section className="auth-card"><div className="auth-language-switch"><LanguageSwitch /></div><p className="eyebrow">TrackFlow Ops</p><h1>{t('Nueva contraseña')}</h1>{!token && <p className="incident-error" role="alert">{t('Falta el token de restablecimiento.')}</p>}<form onSubmit={submit}><label>{t('Nueva contraseña')}<input type="password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} /></label><label>{t('Confirmar contraseña')}<input type="password" required minLength={8} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} /></label>{error && <p className="incident-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={!token || submitting}>{submitting ? t('Guardando…') : t('Guardar contraseña')}</button></form><Link href={localizedPath('/forgot-password', locale)}>{t('Solicitar otro enlace')}</Link></section></main>;
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<main className="auth-page"><section className="auth-card"><p className="eyebrow">TrackFlow Ops</p><h1>New password</h1><p role="status">Loading form…</p></section></main>}><ResetPasswordForm /></Suspense>;
}
