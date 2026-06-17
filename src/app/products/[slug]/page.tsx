import { notFound } from 'next/navigation';
import { getProductBySlugFrom } from '@/data/products';
import { getProducts } from '@/lib/products-store';
import ImageGallery from '@/components/ImageGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGrid from '@/components/ProductGrid';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await getProducts();
  const product = getProductBySlugFrom(products, slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const primaryImage =
    product.previewImage || product.images?.[0] || product.modelImages?.[0];

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      type: 'website',
      title: `${product.name} — Project BLNC`,
      description: product.description,
      url: `/products/${product.slug}`,
      images: primaryImage ? [{ url: primaryImage }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} — Project BLNC`,
      description: product.description,
      images: primaryImage ? [primaryImage] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const products = await getProducts();
  const product = getProductBySlugFrom(products, slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://projectblnc.com';
  const productImages = [
    product.previewImage,
    ...(product.images || []),
    ...(product.modelImages || []),
  ]
    .filter(Boolean)
    .map((src) => (src!.startsWith('http') ? src! : `${siteUrl}${src}`));

  // Structured data so Google can show price, availability, and product info.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: productImages,
    category: product.category,
    brand: {
      '@type': 'Brand',
      name: 'Project BLNC',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: 'BDT',
      price: product.price,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 mb-20 sm:mb-32">
          {/* Image Gallery */}
          <div>
            <ImageGallery
              images={product.images}
              modelImages={product.modelImages}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="lg:pl-12 pt-6 lg:pt-0">
            <div className="mb-6 sm:mb-8">
              <p className="font-description text-xs text-neutral-400 tracking-[0.15em] uppercase mb-2 sm:mb-3">
                {product.category}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 tracking-tight">
                {product.name}
              </h1>
              <p className="text-xl sm:text-2xl font-normal mb-6 sm:mb-8">{product.price} BDT</p>
            </div>

            <div className="mb-8 sm:mb-10">
              <p className="font-description text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <AddToCartButton product={product} />

            {/* Additional Info */}
            <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-neutral-200 space-y-6 sm:space-y-8">
              <div>
                <h3 className="font-description text-xs font-semibold mb-3 tracking-wide uppercase text-neutral-900">Details</h3>
                <ul className="font-description text-sm text-neutral-500 space-y-2 leading-relaxed">
                  <li>Premium quality materials</li>
                  <li>Made to order</li>
                  <li>Free shipping on orders over 200 BDT</li>
                  <li>30-day return policy</li>
                </ul>
              </div>
              <div>
                <h3 className="font-description text-xs font-semibold mb-3 tracking-wide uppercase text-neutral-900">Care Instructions</h3>
                <p className="font-description text-sm text-neutral-500 leading-relaxed">
                  Machine wash cold, tumble dry low. Do not bleach or iron directly
                  on design.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-8 sm:mb-12 tracking-tight">You May Also Like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
