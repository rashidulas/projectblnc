'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  modelImages?: string[];
  productName: string;
}

const MAX_ZOOM = 5;
const MIN_ZOOM = 1;

export default function ImageGallery({ images, modelImages, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Lightbox zoom/pan state
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const baseImages = Array.isArray(images) ? images : [];
  const baseModelImages = Array.isArray(modelImages) ? modelImages : [];

  const hasModelImages = baseModelImages.length > 0;
  const currentImages = hasModelImages ? baseModelImages : baseImages;

  const fallbackImage =
    currentImages[0] ??
    baseImages[0] ??
    baseModelImages[0] ??
    '/placeholder/product-placeholder.webp';

  const resetZoom = () => {
    setScale(1);
    setPos({ x: 0, y: 0 });
  };

  // Reset zoom whenever the image changes or the lightbox opens/closes
  useEffect(() => {
    resetZoom();
  }, [selectedImage, isZoomed]);

  useEffect(() => {
    if (!isZoomed) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsZoomed(false);
      } else if (e.key === 'ArrowLeft') {
        setSelectedImage((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImage((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isZoomed, currentImages.length]);

  const handleWheel = (e: React.WheelEvent) => {
    setScale((prev) => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev - e.deltaY * 0.0016));
      if (next <= MIN_ZOOM) setPos({ x: 0, y: 0 });
      return next;
    });
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return;
    dragRef.current = true;
    setDragging(true);
    lastRef.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - lastRef.current.x;
    const dy = e.clientY - lastRef.current.y;
    lastRef.current = { x: e.clientX, y: e.clientY };
    setPos((p) => ({ x: p.x + dx, y: p.y + dy }));
  };

  const onPointerUp = () => {
    dragRef.current = false;
    setDragging(false);
  };

  return (
    <div className="space-y-6">
      {/* Main image — framed exactly like the home/products preview cards */}
      <button
        onClick={() => setIsZoomed(true)}
        className="relative aspect-[3/5] bg-[#e7ebea] overflow-hidden cursor-zoom-in group w-full"
      >
        <Image
          src={currentImages[selectedImage] ?? fallbackImage}
          alt={`${productName} view ${selectedImage + 1}`}
          fill
          unoptimized
          priority
          className="object-contain transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </button>

      {/* Zoom Modal — base background, sits above the navbar, scroll to zoom, drag to pan */}
      {isZoomed && (
        <div
          ref={modalRef}
          onClick={() => setIsZoomed(false)}
          onWheel={handleWheel}
          className="fixed inset-0 z-[300] bg-[#e7ebea] flex items-center justify-center overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
            className="absolute top-4 right-4 z-10 text-neutral-800 hover:text-neutral-500 transition-colors p-2"
            aria-label="Close zoom"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {currentImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
              className="absolute left-4 z-10 text-neutral-800 hover:text-neutral-500 transition-colors p-2"
              aria-label="Previous image"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Zoomed Image — scroll to zoom, drag to pan, double-click to reset */}
          <div
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={resetZoom}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ cursor: scale > 1 ? (dragging ? 'grabbing' : 'grab') : 'zoom-in' }}
            className="relative w-[90vw] h-[80vh] sm:h-[90vh] overflow-hidden select-none touch-none"
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                transition: dragging ? 'none' : 'transform 0.12s ease-out',
              }}
            >
              <Image
                src={currentImages[selectedImage] ?? fallbackImage}
                alt={`${productName} view ${selectedImage + 1}`}
                fill
                unoptimized
                draggable={false}
                className="object-contain pointer-events-none"
                sizes="90vw"
              />
            </div>
          </div>

          {/* Next Button */}
          {currentImages.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
              className="absolute right-4 z-10 text-neutral-800 hover:text-neutral-500 transition-colors p-2"
              aria-label="Next image"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Hint + Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-600 text-sm font-mono flex items-center gap-4">
            <span className="hidden sm:inline text-neutral-400">scroll to zoom · drag to pan</span>
            <span>{selectedImage + 1} / {currentImages.length}</span>
          </div>
        </div>
      )}

      {/* Thumbnails — same framing so they read as mini previews */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {currentImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-[3/5] bg-[#e7ebea] overflow-hidden transition-all min-h-0 ${
              selectedImage === index ? 'ring-2 ring-neutral-800 ring-offset-2 ring-offset-[#e7ebea]' : 'hover:opacity-80 active:opacity-90'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              unoptimized
              className="object-contain"
              sizes="160px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
