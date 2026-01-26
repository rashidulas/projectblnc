import { notFound } from 'next/navigation';
import { products, getProductBySlug } from '@/data/products';
import ImageGallery from '@/components/ImageGallery';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGrid from '@/components/ProductGrid';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Project BLNC`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-32">
          {/* Image Gallery */}
          <div>
            <ImageGallery
              images={product.images}
              modelImages={product.modelImages}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="lg:pl-12">
            <div className="mb-8">
              <p className="text-xs text-neutral-400 tracking-[0.15em] uppercase mb-3">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-normal mb-8">${product.price}</p>
            </div>

            <div className="mb-10">
              <p className="text-sm text-neutral-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            <AddToCartButton product={product} />

            {/* Additional Info */}
            <div className="mt-16 pt-12 border-t border-neutral-200 space-y-8">
              <div>
                <h3 className="text-xs font-semibold mb-3 tracking-wide uppercase text-neutral-900">Details</h3>
                <ul className="text-sm text-neutral-500 space-y-2 leading-relaxed">
                  <li>Premium quality materials</li>
                  <li>Made to order</li>
                  <li>Free shipping on orders over $200</li>
                  <li>30-day return policy</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold mb-3 tracking-wide uppercase text-neutral-900">Care Instructions</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">
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
            <h2 className="text-2xl font-semibold mb-12 tracking-tight">You May Also Like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
}
