'use client';

import { useLocale } from './LocaleProvider';
import { translate } from '../lib/i18n';

export default function LogoutButton() {
  const locale = useLocale();
  return <form action={`/api/auth/logout?locale=${locale}`} method="post" onSubmit={() => localStorage.removeItem('trackflow_access_token')}><button className="side-link logout-button" type="submit">{translate(locale, 'Cerrar sesión')}</button></form>;
}