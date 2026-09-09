import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'TrackFlow Ops', description: 'Vista operativa de TrackFlow' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
