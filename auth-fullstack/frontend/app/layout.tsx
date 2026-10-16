import type { Metadata, Viewport } from 'next';
import { DM_Sans, Space_Grotesk } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', display: 'swap' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' });

export const metadata: Metadata = { title: 'TrackFlow | Logística que escala con tu e-commerce', description: 'Gestión de almacenes, entregas de última milla y logística inversa en Estados Unidos y España.' };
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={`${dmSans.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning><body>{children}</body></html>;
}
