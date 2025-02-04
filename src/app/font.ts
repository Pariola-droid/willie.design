import { Inter, VT323 } from 'next/font/google';
import localFont from 'next/font/local';

export const sanesans = localFont({
  variable: '--font-sane-sans',
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/sanesans/SaneSans-Slim.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sanesans/SaneSans-Neutral.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sanesans/SaneSans-Median.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sanesans/SaneSans-Bulky.woff2',
      weight: 'bold',
      style: 'normal',
    },
  ],
});

export const sanenik = localFont({
  variable: '--font-sane-nik',
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/sanenik/Sanenik-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sanenik/Sanenik-Regular.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sanenik/Sanenik-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sanenik/Sanenik-Bold.woff2',
      weight: 'bold',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sanenik/Sanenik-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
});

export const vt323 = VT323({
  weight: '400',
  variable: '--font-vt323',
  subsets: ['latin'],
  display: 'swap',
});

export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});
