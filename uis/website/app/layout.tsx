import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TrackFlow | Logística que escala con tu e-commerce',
  description: 'Almacenes, última milla y logística inversa en Estados Unidos y España.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
