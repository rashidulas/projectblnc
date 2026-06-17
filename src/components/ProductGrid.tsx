import { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  editorial?: boolean;
  showcase?: boolean;
}

export default function ProductGrid({ products, editorial = false, showcase = false }: ProductGridProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ${
        showcase ? 'gap-8 sm:gap-10 md:gap-12' : editorial ? 'gap-8 sm:gap-10' : 'gap-6 sm:gap-8'
      }`}
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-up"
          // Stagger each card slightly so they cascade in (capped so long
          // grids don't feel slow). Purely visual; reduced-motion disables it.
          style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
        >
          <ProductCard product={product} editorial={editorial} showcase={showcase} />
        </div>
      ))}
    </div>
  );
}
