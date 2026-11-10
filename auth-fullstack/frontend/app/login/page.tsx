'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import SiteNavbar from '../../components/SiteNavbar';
import { useLocale } from '../../components/LocaleProvider';
import { localizedPath, translate } from '../../lib/i18n';

function destination(locale: 'es' | 'en') {
  const next = new URLSearchParams(window.location.search).get('next');
  if (!next?.startsWith('/')) return localizedPath('/ops', locale);
  try {
    const target = new URL(next, window.location.origin);
    return target.origin === window.location.origin ? `${localizedPath(target.pathname, locale)}${target.search}${target.hash}` : localizedPath('/ops', locale);
  } catch {
    return localizedPath('/ops', locale);
  }
}

export default function LoginPage() {
  const locale = useLocale();
  const t = (text: string) => translate(locale, text);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const emailError = !email ? t('Ingresa tu email.') : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? t('Ingresa un email válido.') : '';
  const passwordError = !password ? t('Ingresa tu contraseña.') : '';

  useEffect(() => {
    const token = localStorage.getItem('trackflow_access_token');
    if (!token) return;
    const controller = new AbortController();
    fetch('/api/auth/session', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then(response => {
        if (response.ok) window.location.replace(destination(locale));
        else if (response.status === 401) localStorage.removeItem('trackflow_access_token');
      })
      .catch(() => {});
    return () => controller.abort();
  }, [locale]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setTouched({ email: true, password: true });
    if (emailError || passwordError) return;
    setSubmitting(true);
    try {
      const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      if (!response.ok) {
        setError(response.status >= 500 ? t('El servicio no está disponible. Inténtalo de nuevo.') : t('El email o la contraseña no son correctos.'));
        return;
      }
      const data = await response.json() as { access_token?: string };
      if (!data.access_token) {
        setError(t('La respuesta del servicio no es válida. Inténtalo de nuevo.'));
        return;
      }
      localStorage.setItem('trackflow_access_token', data.access_token);
      window.location.replace(destination(locale));
    } catch {
      setError(t('No se pudo conectar con el servicio. Inténtalo de nuevo.'));
    } finally {
      setSubmitting(false);
    }
  }

  return <div className="page-shell login-shell"><SiteNavbar currentPage="login" /><main className="auth-page"><section className="auth-card"><p className="eyebrow">TrackFlow Ops</p><h1>{t('Iniciar sesión')}</h1>
    <form onSubmit={submit} noValidate>
      <div className="field"><label>{t('Email')}<input type="email" required value={email} aria-invalid={touched.email && Boolean(emailError)} aria-describedby="login-email-error" onBlur={() => setTouched((current) => ({ ...current, email: true }))} onChange={(event) => setEmail(event.target.value)} /></label><span id="login-email-error" className="form-message error" aria-live="polite">{touched.email ? emailError : ''}</span></div>
      <div className="field"><label>{t('Contraseña')}<input type="password" required value={password} aria-invalid={touched.password && Boolean(passwordError)} aria-describedby="login-password-error" onBlur={() => setTouched((current) => ({ ...current, password: true }))} onChange={(event) => setPassword(event.target.value)} /></label><span id="login-password-error" className="form-message error" aria-live="polite">{touched.password ? passwordError : ''}</span></div>
      {error && <p className="incident-error" role="alert">{error}</p>}
      <button className="primary-button" type="submit" disabled={submitting}>{submitting ? t('Accediendo…') : t('Entrar')}</button>
    </form><Link href={localizedPath('/forgot-password', locale)}>{t('¿Olvidaste tu contraseña?')}</Link><br /><Link href={localizedPath('/register', locale)}>{t('Crear una cuenta')}</Link></section></main></div>;
}
