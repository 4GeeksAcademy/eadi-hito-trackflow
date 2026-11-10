import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

type SiteNavbarProps = {
  currentPage?: 'home' | 'login';
};

export default function SiteNavbar({ currentPage = 'home' }: SiteNavbarProps) {
  const sectionHref = (section: string) => currentPage === 'home' ? `#${section}` : `/#${section}`;

  return (
    <header className="site-header">
      <nav className="container site-nav" aria-label="Navegación principal">
        <a href={sectionHref('inicio')} className="brand-lockup" aria-label="TrackFlow, inicio">
          <Image src="/trackflow-logo.png" alt="" width={40} height={36} className="brand-mark brand-mark-light" />
          <Image src="/trackflow-logo.png" alt="" width={40} height={36} className="brand-mark brand-mark-dark" />
          <span className="brand-wordmark">Track<span>Flow</span></span>
        </a>
        <div className="site-nav-links">
          {currentPage === 'login' ? <Link className="nav-link" href="/">Volver al inicio</Link> : <>
          <a className="nav-link" href={sectionHref('servicios')}>Servicios</a>
          <a className="nav-link" href={sectionHref('cobertura')}>Cobertura</a>
          <Link className="nav-link" href="/login">Acceder</Link>
          </>}
          <ThemeToggle />
          {currentPage !== 'login' && <a className="button button-primary" href={sectionHref('contacto')}>Solicitar información</a>}
        </div>
      </nav>
    </header>
  );
}