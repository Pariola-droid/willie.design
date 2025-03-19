import localFont from 'next/font/local';

// bagoss
export const bagoss = localFont({
  variable: '--font-bagoss',
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/bs/BSL.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/bs/BSR.woff2',
      weight: 'normal',
      style: 'normal',
    },
    {
      path: '../../public/fonts/bs/BSM.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/bs/BSSB.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
});

// cowboy
export const cowboy = localFont({
  variable: '--font-cowboy',
  display: 'swap',
  src: [
    {
      path: '../../public/fonts/cowboy/Mersey-Cowboy.otf',
      weight: '400',
      style: 'normal',
    },
  ],
});
