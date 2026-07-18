import type { Metadata } from 'next';
import HomeHero from '@/components/HomeHero';
import HomeCollection from '@/components/HomeCollection';
import { getProducts } from '@/lib/products-store';

export const metadata: Metadata = {
  title: 'Shop Luxury Streetwear Essentials',
  description:
    'Shop Project BLNC — premium hoodies, pants, and tees in a refined monochrome aesthetic. Luxury streetwear essentials, redefined.',
  alternates: {
    canonical: '/home',
  },
  openGraph: {
    type: 'website',
    title: 'Shop Luxury Streetwear Essentials — Project BLNC',
    description:
      'Premium hoodies, pants, and tees in a refined monochrome aesthetic.',
    url: '/home',
  },
};

export default async function HomePage() {
  const all = await getProducts();

  const shuffledProducts = [...all];
  for (let i = shuffledProducts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledProducts[i], shuffledProducts[j]] = [shuffledProducts[j], shuffledProducts[i]];
  }

  const featuredProducts = shuffledProducts.slice(0, 8);

  return (
    <>
      <link rel="preload" href="/hero/g1.mp4" as="video" type="video/mp4" />
      <main className="bg-[#e7ebea] overflow-x-hidden">
        <HomeHero />

        <HomeCollection products={featuredProducts} />

        <div className="h-32 bg-[#e7ebea]" />
      </main>
    </>
  );
}
