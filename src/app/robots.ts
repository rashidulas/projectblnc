import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://projectblnc.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep admin, API, auth, and checkout flows out of search indexes.
        disallow: ['/admin', '/api/', '/checkout', '/customer/login'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
