'use client';

import { useState, useEffect, useRef } from 'react';
import TransitionLink from '@/components/TransitionLink';
import Image from 'next/image';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  editorial?: boolean;
  /** Card layout: image, title + price row, description (screenshot style) */
  showcase?: boolean;
}

const HOVER_CYCLE_MS = 2500;

export default function ProductCard({ product, editorial = false, showcase = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const imageList = (product.modelImages?.length ? product.modelImages : product.images) || product.images;
  const hasMultipleImages = imageList.length > 1;

  useEffect(() => {
    if (!hasMultipleImages || !hovered) return;
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, HOVER_CYCLE_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [hovered, hasMultipleImages, imageList.length]);

  const handleMouseEnter = () => {
    setHovered(true);
    setCurrentIndex(0);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setCurrentIndex(0);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  if (showcase) {
    return (
      <TransitionLink
        href={`/products/${product.slug}`}
        className="group block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden mb-4 sm:mb-5">
          {imageList.map((src, i) => (
            <div
              key={src}
              className="absolute inset-0 transition-opacity duration-500 ease-out"
              style={{ opacity: i === currentIndex ? 1 : 0 }}
            >
              <Image
                src={src}
                alt={`${product.name} - ${i + 1}`}
                fill
                className="object-cover transition-all duration-500 ease-out grayscale group-hover:grayscale-0 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-1.5">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-neutral-900 tracking-tight">
            {product.name}
          </h3>
          <span className="text-xs sm:text-[13px] text-neutral-600 font-normal">
            from ${product.price} USD
          </span>
        </div>
        <p className="text-xs sm:text-[13px] text-neutral-600 font-normal leading-[1.5] line-clamp-2">
          {product.description}
        </p>
      </TransitionLink>
    );
  }

  if (editorial) {
    return (
      <TransitionLink href={`/products/${product.slug}`} className="group block">
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
      </TransitionLink>
    );
  }

  return (
    <TransitionLink href={`/products/${product.slug}`} className="group block">
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
    </TransitionLink>
  );
}
