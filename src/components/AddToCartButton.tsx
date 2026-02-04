'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import { ShoppingBag } from 'lucide-react';

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { addToCart } = useCart();

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
        <label className="font-description block text-xs font-semibold mb-4 tracking-wide uppercase text-neutral-900">
          Select Size
        </label>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`min-w-[44px] min-h-[44px] px-5 sm:px-6 py-3 text-sm font-medium tracking-wide transition-all border ${
                selectedSize === size
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900 active:bg-neutral-100'
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
        className="w-full bg-black text-white py-4 min-h-[48px] hover:opacity-90 active:opacity-95 transition-opacity font-medium flex items-center justify-center gap-3 text-sm tracking-wide"
      >
        <ShoppingBag className="w-5 h-5" />
        ADD TO CART
      </button>
    </div>
  );
}
