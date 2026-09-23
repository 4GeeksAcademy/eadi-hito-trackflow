import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'TrackFlow | Logística que escala con tu e-commerce', description: 'Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España.' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" suppressHydrationWarning><body>{children}</body></html>;
}
