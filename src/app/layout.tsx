import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'DesignOS — AI-native design studio', description: 'Turn ambiguous product ideas into research plans, screen specs, prototypes, and validation checks.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
