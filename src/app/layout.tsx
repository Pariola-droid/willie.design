import AbstractApp from '@/components/common/AbstractApp';
import { GOOGLE_ANALYTICS } from '@/config/env';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { bagoss, cowboy } from './font';

export const metadata: Metadata = {
  metadataBase: new URL('https://willie.design'),
  title: 'Willie UI',
  description: `I'm creative designer with keen interest in design`,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    title: 'Willie UI',
    description: `I'm creative designer with keen interest in design`,
    images: [
      {
        url: '/og-image-b.jpg',
        width: 800,
        height: 600,
      },
      {
        url: '/og-image-b.jpg',
        width: 1800,
        height: 1600,
      },
    ],
  },
  openGraph: {
    title: 'Willie UI',
    description: `I'm creative designer with keen interest in design`,
    url: 'https://willie.design',
    siteName: 'Pariola',
    images: [
      {
        url: '/og-image-b.jpg',
        width: 800,
        height: 600,
      },
      {
        url: '/og-image-b.jpg',
        width: 1800,
        height: 1600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#000000' },
    { media: '(prefers-color-scheme: dark)', color: '#ffffff' },
  ],
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  width: 'device-width',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${bagoss.variable} ${cowboy.variable}`}>
      <body>
        <AbstractApp>{children}</AbstractApp>
        <GoogleAnalytics gaId={`${GOOGLE_ANALYTICS}`} />
      </body>
    </html>
  );
}
