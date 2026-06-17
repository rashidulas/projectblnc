import { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  editorial?: boolean;
  showcase?: boolean;
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3 gap-y-12">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-up"
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
          <ProductCard product={product} priority={index < 4} />
        </div>
      ))}
    </div>
  );
}
