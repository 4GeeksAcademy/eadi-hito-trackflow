'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import SiteNavbar from '../../components/SiteNavbar';
import { useLocale } from '../../components/LocaleProvider';
import { localizedPath, translate } from '../../lib/i18n';

export default function ForgotPasswordPage() {
  const locale = useLocale();
  const t = (text: string) => translate(locale, text);
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
      if (!response.ok) {
        setError(response.status === 503 ? t('El servicio de correo no está disponible. Contacta con el administrador.') : t('No se pudo enviar la solicitud. Inténtalo de nuevo.'));
        return;
      }
      setSent(true);
    } catch {
      setError(t('No se pudo enviar la solicitud. Inténtalo de nuevo.'));
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="page-shell login-shell"><SiteNavbar currentPage="login" /><main className="auth-page"><section className="auth-card"><p className="eyebrow">TrackFlow Ops</p><h1>{t('Recuperar contraseña')}</h1>{sent ? <><p role="status">{t('Si esa dirección está registrada, recibirás un enlace en breve.')}</p><Link href={localizedPath('/login', locale)}>{t('Volver a iniciar sesión')}</Link></> : <form onSubmit={submit}><label>{t('Email')}<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>{error && <p className="incident-error" role="alert">{error}</p>}<button className="primary-button" type="submit" disabled={submitting}>{submitting ? t('Enviando…') : t('Enviar enlace')}</button></form>}</section></main></div>;
}
