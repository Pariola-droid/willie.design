import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Zeity - Your global timezone companion',
    short_name: 'Zeity',
    description:
      'Keep track of time across the world with friends and family, a beautifully crafted Chrome extension for tracking global connections.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1c1c1c',
    theme_color: '#1c1c1c',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
