'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  modelImages?: string[];
  productName: string;
}

export default function ImageGallery({ images, modelImages, productName }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Normalize image arrays so we never read from an empty / undefined list
  const baseImages = Array.isArray(images) ? images : [];
  const baseModelImages = Array.isArray(modelImages) ? modelImages : [];

  const hasModelImages = baseModelImages.length > 0;
  const currentImages = hasModelImages ? baseModelImages : baseImages;

  // If for some reason both are empty, bail out gracefully
  const fallbackImage =
    currentImages[0] ??
    baseImages[0] ??
    baseModelImages[0] ??
    '/placeholder/product-placeholder.png';

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

  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev > 0 ? prev - 1 : currentImages.length - 1));
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev < currentImages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => setIsZoomed(true)}
        className="relative aspect-square bg-neutral-50 overflow-hidden cursor-zoom-in group w-full"
      >
        <Image
          src={currentImages[selectedImage] ?? fallbackImage}
          alt={`${productName} view ${selectedImage + 1}`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
          </div>
        </div>
      </button>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 z-50 text-white hover:text-neutral-300 transition-colors p-2"
            aria-label="Close zoom"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          {currentImages.length > 1 && (
            <button
              onClick={handlePrevImage}
              className="absolute left-4 z-50 text-white hover:text-neutral-300 transition-colors p-2"
              aria-label="Previous image"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Zoomed Image */}
          <div className="relative w-[90vw] h-[80vh] sm:h-[90vh] flex items-center justify-center">
            <Image
              src={currentImages[selectedImage] ?? fallbackImage}
              alt={`${productName} view ${selectedImage + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 60vw"
            />
          </div>

          {/* Next Button */}
          {currentImages.length > 1 && (
            <button
              onClick={handleNextImage}
              className="absolute right-4 z-50 text-white hover:text-neutral-300 transition-colors p-2"
              aria-label="Next image"
            >
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-description">
            {selectedImage + 1} / {currentImages.length}
          </div>
        </div>
      )}

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {currentImages.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square bg-neutral-50 overflow-hidden transition-all min-h-0 ${
              selectedImage === index ? 'ring-2 ring-black ring-offset-2' : 'hover:opacity-80 active:opacity-90'
            }`}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
