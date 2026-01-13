'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MediaGalleryItem } from '@/lib/magento/graphql';

interface ImageGalleryProps {
    images: MediaGalleryItem[];
    productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
    // Filter out disabled images and sort by position
    const activeImages = images
        .filter(img => !img.disabled)
        .sort((a, b) => a.position - b.position);

    const [selectedIndex, setSelectedIndex] = useState(0);

    if (activeImages.length === 0) {
        return (
            <div className="relative aspect-video lg:aspect-[21/9] bg-gradient-to-br from-sky-500 to-amber-500" />
        );
    }

    const selectedImage = activeImages[selectedIndex];

    return (
        <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-video lg:aspect-[21/9] overflow-hidden">
                <Image
                    src={selectedImage.url}
                    alt={selectedImage.label || productName}
                    fill
                    className="object-cover transition-opacity duration-300"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Product Name Overlay */}
                <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-2xl lg:text-4xl font-bold text-white">
                        {productName}
                    </h2>
                </div>

                {/* Navigation Arrows (if more than 1 image) */}
                {activeImages.length > 1 && (
                    <>
                        <button
                            onClick={() => setSelectedIndex(prev => prev === 0 ? activeImages.length - 1 : prev - 1)}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                            aria-label="Previous image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setSelectedIndex(prev => prev === activeImages.length - 1 ? 0 : prev + 1)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                            aria-label="Next image"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails (if more than 1 image) */}
            {activeImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-black/20">
                    {activeImages.map((image, index) => (
                        <button
                            key={image.url}
                            onClick={() => setSelectedIndex(index)}
                            className={`relative flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden transition-all duration-200 ${index === selectedIndex
                                    ? 'ring-2 ring-sky-500 ring-offset-2 ring-offset-black'
                                    : 'opacity-60 hover:opacity-100'
                                }`}
                        >
                            <Image
                                src={image.url}
                                alt={image.label || `${productName} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Image Counter */}
            {activeImages.length > 1 && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                    {selectedIndex + 1} / {activeImages.length}
                </div>
            )}
        </div>
    );
}
