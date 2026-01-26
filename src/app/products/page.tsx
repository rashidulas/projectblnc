'use client';

import { useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import CategoryTabs from '@/components/CategoryTabs';
import { products, getProductsByCategory } from '@/data/products';

const categories = ['All', 'Hoodies', 'Pants', 'T-Shirts'];

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = getProductsByCategory(activeCategory);

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Lots of Whitespace */}
        <div className="mb-20">
          <h1 className="text-3xl md:text-5xl font-semibold mb-8 tracking-tight">
            All Products
          </h1>
          <p className="text-neutral-500 max-w-xl text-sm md:text-base leading-relaxed">
            Explore our complete collection of luxury streetwear. Each piece is
            designed to stand the test of time.
          </p>
        </div>

        {/* Category Filters - Small and Minimal */}
        <div className="mb-16">
          <CategoryTabs
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Products Grid - Editorial Style */}
        <ProductGrid products={filteredProducts} />

        {/* Results Count */}
        <div className="mt-16 text-center text-xs text-neutral-400 tracking-wide">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'PRODUCT' : 'PRODUCTS'}
        </div>
      </div>
    </div>
  );
}
