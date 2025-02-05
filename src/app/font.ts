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
