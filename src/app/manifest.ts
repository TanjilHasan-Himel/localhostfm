import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'T Double H FM',
    short_name: 'tdoubleh fm',
    description: 'Welcome to T Double H FM, the ultimate live radio station curated by Tanjil Hasan Himel. Enjoy 24/7 lofi beats, morning routines, and live broadcasts.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
