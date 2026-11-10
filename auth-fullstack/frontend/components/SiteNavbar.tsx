import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitch from './LanguageSwitch';
import { useLocale } from './LocaleProvider';
import ThemeToggle from './ThemeToggle';
import { localizedPath, translate } from '../lib/i18n';

type SiteNavbarProps = {
  currentPage?: 'home' | 'login';
};

export default function SiteNavbar({ currentPage = 'home' }: SiteNavbarProps) {
  const locale = useLocale();
  const t = (text: string) => translate(locale, text);
  const home = localizedPath('/', locale);
  const sectionHref = (section: string) => currentPage === 'home' ? `#${section}` : `${home}#${section}`;

  return (
    <header className="site-header">
      <nav className="container site-nav" aria-label={t('Navegación principal')}>
        <a href={currentPage === 'home' ? '#inicio' : home} className="brand-lockup" aria-label={t('TrackFlow, inicio')}>
          <Image src="/trackflow-logo.png" alt="" width={40} height={36} className="brand-mark brand-mark-light" />
          <Image src="/trackflow-logo.png" alt="" width={40} height={36} className="brand-mark brand-mark-dark" />
          <span className="brand-wordmark">Track<span>Flow</span></span>
        </a>
        <div className="site-nav-links">
          {currentPage === 'login' ? <Link className="nav-link" href={home}>{t('Volver al inicio')}</Link> : <>
          <a className="nav-link" href={sectionHref(locale === 'en' ? 'services' : 'servicios')}>{t('Servicios')}</a>
          <a className="nav-link" href={sectionHref(locale === 'en' ? 'coverage' : 'cobertura')}>{t('Cobertura')}</a>
          <a className="nav-link" href={sectionHref('careers')}>{locale === 'en' ? 'Careers' : 'Trabaja con nosotros'}</a>
          <Link className="nav-link" href={localizedPath('/login', locale)}>{t('Acceder')}</Link>
          </>}
          <LanguageSwitch />
          <ThemeToggle />
          {currentPage !== 'login' && <a className="button button-primary" href={sectionHref(locale === 'en' ? 'contact' : 'contacto')}>{t('Solicitar información')}</a>}
        </div>
      </nav>
    </header>
  );
}