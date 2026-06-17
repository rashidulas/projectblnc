'use client';

import { useState, useEffect, useRef } from 'react';
import TransitionLink from '@/components/TransitionLink';
import Image from 'next/image';
import { Product } from '@/data/products';

interface ProductCardProps {
  product: Product;
  editorial?: boolean;
  showcase?: boolean;
  /** Eager-load the image (use for the first, above-the-fold row). */
  priority?: boolean;
}

const HOVER_CYCLE_MS = 2500;

export default function ProductCard({ product, priority = false }: ProductCardProps) {
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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [hovered, hasMultipleImages, imageList.length]);

  const handleMouseEnter = () => { setHovered(true); setCurrentIndex(0); };
  const handleMouseLeave = () => {
    setHovered(false);
    setCurrentIndex(0);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  };

  return (
    <TransitionLink
      href={`/products/${product.slug}`}
      className="group block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image area — tall frame + cover so the full-body model fills it and the empty sides crop away */}
      <div className="relative aspect-[3/5] overflow-hidden mb-4">
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
              unoptimized
              priority={priority && i === 0}
              className="object-contain"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ))}
      </div>

      {/* Labels — centered, monospace */}
      <div className="text-center space-y-1.5">
        <p className="font-mono text-[14px] text-neutral-400 tracking-widest uppercase">
          {product.category}
        </p>
        <p className="font-mono text-[17px] text-neutral-800 lowercase leading-snug">
          {product.name}
        </p>
        <p className="font-mono text-[17px] text-neutral-600">
          {product.price} BDT
        </p>
      </div>
    </TransitionLink>
  );
}
