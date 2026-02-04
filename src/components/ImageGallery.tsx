'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  modelImages: string[];
  productName: string;
}

export default function ImageGallery({ images, modelImages, productName }: ImageGalleryProps) {
  const [activeTab, setActiveTab] = useState<'product' | 'model'>('product');
  const [selectedImage, setSelectedImage] = useState(0);

  const currentImages = activeTab === 'product' ? images : modelImages;

  return (
    <div className="space-y-6">
      {/* Tab Buttons - Minimal Style */}
      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={() => {
            setActiveTab('product');
            setSelectedImage(0);
          }}
          className={`min-h-[44px] px-4 sm:px-5 py-2.5 sm:py-2 text-xs font-medium tracking-wide transition-all border ${
            activeTab === 'product'
              ? 'bg-black text-white border-black'
              : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-900 active:bg-neutral-50'
          }`}
        >
          PRODUCT
        </button>
        <button
          onClick={() => {
            setActiveTab('model');
            setSelectedImage(0);
          }}
          className={`min-h-[44px] px-4 sm:px-5 py-2.5 sm:py-2 text-xs font-medium tracking-wide transition-all border ${
            activeTab === 'model'
              ? 'bg-black text-white border-black'
              : 'bg-white text-neutral-600 border-neutral-300 hover:border-neutral-900 active:bg-neutral-50'
          }`}
        >
          MODEL
        </button>
      </div>

      {/* Main Image */}
      <div className="relative aspect-square bg-neutral-50 overflow-hidden">
        <Image
          src={currentImages[selectedImage]}
          alt={`${productName} - ${activeTab} view ${selectedImage + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

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
              sizes="100px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
