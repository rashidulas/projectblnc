import type { NextConfig } from 'next';

const securityHeaders = [
  // Prevent the site from being framed (clickjacking protection).
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Stop browsers from MIME-sniffing away from the declared content-type.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Control how much referrer info is sent.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Lock down powerful browser features by default.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  // Force HTTPS for two years, including subdomains.
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
];

const nextConfig: NextConfig = {
  images: {
    // Images are already compressed to WebP; skip Next.js's optimizer
    // (it was rendering them blank) and serve the files directly.
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
