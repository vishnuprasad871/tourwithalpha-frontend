'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookingProduct } from '@/lib/magento/graphql';

interface BookingSliderProps {
    products: BookingProduct[];
}

export default function BookingSlider({ products }: BookingSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || products.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % products.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, products.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
        setIsAutoPlaying(false);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
        setIsAutoPlaying(false);
    };

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Slider Container */}
            <div className="relative overflow-hidden rounded-2xl">
                {/* Slides */}
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {products.map((product) => (
                        <div key={product.sku} className="min-w-full">
                            <div className="relative aspect-[16/9] md:aspect-[21/9]">
                                {/* Background Image */}
                                <Image
                                    src={product.image?.url || product.media_gallery?.[0]?.url || '/placeholder-tour.jpg'}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                    priority={currentIndex === 0}
                                />

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                                {/* Content */}
                                <div className="absolute inset-0 flex items-center">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                                        <div className="max-w-2xl">
                                            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                                                {product.name}
                                            </h3>

                                            <div className="flex items-baseline gap-3 mb-6">
                                                <span className="text-2xl md:text-3xl font-bold gradient-text">
                                                    ${product.price_range.maximum_price.final_price.value.toFixed(2)}
                                                </span>
                                                <span className="text-gray-300 text-lg">
                                                    {product.price_range.maximum_price.final_price.currency}
                                                </span>
                                            </div>

                                            <Link
                                                href={`/booking/${product.url_key}`}
                                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-full font-semibold text-lg hover:from-sky-400 hover:to-amber-400 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-sky-400/25"
                                            >
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {products.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                            aria-label="Previous slide"
                        >
                            <svg
                                className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>

                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                            aria-label="Next slide"
                        >
                            <svg
                                className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Dots Indicator */}
            {products.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {products.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${index === currentIndex
                                    ? 'w-8 h-3 bg-gradient-to-r from-sky-500 to-amber-500'
                                    : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
