'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/lib/magento/graphql';

interface GalleryGridProps {
    images: GalleryImage[];
    isLoading?: boolean;
}

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function GalleryGrid({ images, isLoading = false }: GalleryGridProps) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setLightboxIndex(index);
    const closeLightbox = () => setLightboxIndex(null);

    const goPrev = useCallback(() => {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
    }, [images.length]);

    const goNext = useCallback(() => {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
    }, [images.length]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') goPrev();
            if (e.key === 'ArrowRight') goNext();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightboxIndex, goPrev, goNext]);

    // Loading skeleton
    if (isLoading) {
        return (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="break-inside-avoid rounded-xl bg-white/5 animate-pulse"
                        style={{ height: `${180 + (i % 3) * 60}px` }}
                    />
                ))}
            </div>
        );
    }

    if (images.length === 0) {
        return (
            <div className="text-center py-20 text-gray-500">
                <div className="text-5xl mb-4">🖼️</div>
                <p className="text-lg">No images found in this folder.</p>
            </div>
        );
    }

    const currentImage = lightboxIndex !== null ? images[lightboxIndex] : null;

    return (
        <>
            {/* Masonry Grid */}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
                {images.map((image, index) => (
                    <div
                        key={image.relative_path}
                        className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
                        onClick={() => openLightbox(index)}
                    >
                        <div className="relative w-full overflow-hidden rounded-xl bg-white/5">
                            <Image
                                src={image.url}
                                alt={image.filename}
                                width={400}
                                height={300}
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                <p className="text-white text-xs font-medium truncate">{image.filename}</p>
                                <p className="text-gray-400 text-xs">{formatFileSize(image.size)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox */}
            {currentImage && lightboxIndex !== null && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors z-10"
                        aria-label="Close"
                    >
                        ✕
                    </button>

                    {/* Prev button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors z-10"
                            aria-label="Previous"
                        >
                            ‹
                        </button>
                    )}

                    {/* Next button */}
                    {images.length > 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl transition-colors z-10"
                            aria-label="Next"
                        >
                            ›
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="relative max-w-5xl max-h-[85vh] mx-16 flex flex-col items-center gap-3"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={currentImage.url}
                            alt={currentImage.filename}
                            width={1200}
                            height={800}
                            className="max-h-[78vh] w-auto object-contain rounded-xl shadow-2xl"
                            unoptimized
                        />
                        <div className="text-center">
                            <p className="text-white font-medium">{currentImage.filename}</p>
                            <p className="text-gray-400 text-sm">
                                {formatFileSize(currentImage.size)} • {currentImage.extension.toUpperCase()} •{' '}
                                {lightboxIndex + 1} / {images.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
