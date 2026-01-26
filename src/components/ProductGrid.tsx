import { Product } from '@/data/products';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  editorial?: boolean;
}

export default function ProductGrid({ products, editorial = false }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 ${editorial ? 'gap-10' : 'gap-8'}`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} editorial={editorial} />
      ))}
    </div>
  );
}
