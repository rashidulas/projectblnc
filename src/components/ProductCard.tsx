import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  editorial?: boolean;
}

export default function ProductCard({ product, editorial = false }: ProductCardProps) {
  if (editorial) {
    return (
      <Link href={`/products/${product.slug}`} className="group block">
        <div className="relative aspect-[3/4] bg-neutral-50 overflow-hidden mb-6">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs text-neutral-400 tracking-[0.15em] uppercase">
            {product.category}
          </p>
          <h3 className="text-sm font-normal text-neutral-900 tracking-wide">
            {product.name}
          </h3>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-square bg-neutral-50 overflow-hidden mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-neutral-500 tracking-wide uppercase">{product.category}</p>
        <h3 className="font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-semibold">${product.price}</p>
      </div>
    </Link>
  );
}
