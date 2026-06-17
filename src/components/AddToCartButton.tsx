'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import { ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [sizeChartSource, setSizeChartSource] = useState<'category' | 'default' | 'missing'>('category');
  const { addToCart } = useCart();

  const categorySlug = product.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const categorySizeChartPath = `/size-charts/${categorySlug}.webp`;
  const defaultSizeChartPath = '/size-charts/default.webp';

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    addToCart(product, selectedSize);
  };

  return (
    <div className="space-y-8">
      {/* Size Selector */}
      <div>
        <div className="flex items-center justify-between gap-4 mb-4">
          <label className="font-description block text-xs font-semibold tracking-wide uppercase text-neutral-900">
            Select Size
          </label>
          <button
            type="button"
            onClick={() => {
              setSizeChartSource('category');
              setIsSizeChartOpen(true);
            }}
            className="font-description text-xs text-neutral-900 underline underline-offset-2 hover:text-neutral-600 transition-colors"
          >
            Size chart
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`min-w-[44px] min-h-[44px] px-5 sm:px-6 py-3 text-sm font-medium tracking-wide transition-all border ${
                selectedSize === size
                  ? 'bg-neutral-800 text-neutral-50 border-neutral-800'
                  : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-neutral-800 active:bg-neutral-200'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="w-full bg-neutral-800 text-neutral-50 py-4 min-h-[48px] hover:opacity-90 active:opacity-95 transition-opacity font-medium flex items-center justify-center gap-3 text-sm tracking-wide"
      >
        <ShoppingBag className="w-5 h-5" />
        ADD TO CART
      </button>

      {/* Size Chart Modal */}
      {isSizeChartOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setIsSizeChartOpen(false)}
        >
          <div
            className="relative w-full max-w-7xl h-[85vh] sm:h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSizeChartOpen(false)}
              className="absolute right-2 top-2 z-10 text-white/80 hover:text-white transition-colors"
              aria-label="Close size chart"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {sizeChartSource !== 'missing' && (
              <div className="relative w-full h-full">
                <Image
                  src={sizeChartSource === 'category' ? categorySizeChartPath : defaultSizeChartPath}
                  alt={sizeChartSource === 'category' ? `${product.category} size chart` : 'Default size chart'}
                  fill
                  className="object-contain"
                  sizes="95vw"
                  onError={() =>
                    setSizeChartSource((prev) => (prev === 'category' ? 'default' : 'missing'))
                  }
                />
              </div>
            )}

            {sizeChartSource === 'missing' && (
              <p className="font-description text-xs text-white/80 mt-4">
                Add chart images in /public/size-charts as hoodies.png, pants.png, t-shirts.png, or default.png.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
