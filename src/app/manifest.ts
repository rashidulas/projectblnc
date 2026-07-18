import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Project BLNC — Luxury Streetwear',
    short_name: 'BLNC',
    description:
      'Project BLNC is a luxury streetwear label redefining everyday essentials.',
    start_url: '/home',
    display: 'standalone',
    background_color: '#e7ebea',
    theme_color: '#171717',
    icons: [
      { src: '/icon.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
