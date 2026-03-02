/**
 * @fileoverview Root layout with PWA metadata and font configuration.
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Meus Gastos',
    template: '%s - Meus Gastos',
  },
  description: 'Gerenciador de despesas pessoais',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Meus Gastos',
  },
};

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
