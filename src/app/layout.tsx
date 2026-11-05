import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'DesignOS — Midnight AI Design Studio', description: 'An AI-native product design workspace to plan, generate and refine digital experiences.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
