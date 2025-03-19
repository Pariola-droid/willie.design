import AbstractApp from '@/components/common/AbstractApp';
import { GOOGLE_ANALYTICS } from '@/config/env';
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata, Viewport } from 'next';
import { ViewTransitions } from 'next-view-transitions';
import { bagoss, cowboy } from './font';

export const metadata: Metadata = {
  metadataBase: new URL('https://willie.design'),
  title: 'Willie UI',
  description: `I'm creative visual designer focused on playing with layout compositions, colors and typography to create immersive digital experiences.`,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    title: 'Willie UI',
    description: `I'm creative visual designer focused on playing with layout compositions, colors and typography to create immersive digital experiences.`,
    images: [
      {
        url: '/og-image-md.jpg',
        width: 800,
        height: 600,
      },
      {
        url: '/og-image-lg.jpg',
        width: 1800,
        height: 1600,
      },
    ],
  },
  openGraph: {
    title: 'Willie UI',
    description: `I'm creative visual designer focused on playing with layout compositions, colors and typography to create immersive digital experiences.`,
    url: 'https://willie.design',
    siteName: 'Willie UI',
    images: [
      {
        url: '/og-image-md.jpg',
        width: 800,
        height: 600,
      },
      {
        url: '/og-image-lg.jpg',
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
        <ViewTransitions>
          <AbstractApp>{children}</AbstractApp>
        </ViewTransitions>
        <GoogleAnalytics gaId={`${GOOGLE_ANALYTICS}`} />
      </body>
    </html>
  );
}
