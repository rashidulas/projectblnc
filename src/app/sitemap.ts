import type { MetadataRoute } from 'next';
import { getProducts } from '@/lib/products-store';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://projectblnc.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/news`, changeFrequency: 'weekly', priority: 0.5 },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts();
    productRoutes = products.map((product) => ({
      url: `${SITE_URL}/products/${product.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // If the DB is unavailable at build time, ship the static routes only.
  }

  return [...staticRoutes, ...productRoutes];
}
