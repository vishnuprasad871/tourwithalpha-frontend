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
    const [productsPerSlide, setProductsPerSlide] = useState(3);

    // Adjust products per slide based on screen size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setProductsPerSlide(1);
            } else if (window.innerWidth < 1024) {
                setProductsPerSlide(2);
            } else {
                setProductsPerSlide(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Calculate total number of slides
    const totalSlides = Math.ceil(products.length / productsPerSlide);
    const canNavigate = totalSlides > 1;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Get products for current slide
    const startIdx = currentIndex * productsPerSlide;
    const currentProducts = products.slice(startIdx, startIdx + productsPerSlide);

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="relative">
            {/* Products Grid */}
            <div className="relative overflow-hidden">
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 transition-opacity duration-500"
                >
                    {currentProducts.map((product) => (
                        <Link
                            key={product.sku}
                            href={`/booking/${product.url_key}`}
                            className="group block"
                        >
                            <div className="glass rounded-2xl overflow-hidden hover:border-sky-400/50 transition-all duration-300 h-full flex flex-col">
                                {/* Product Image */}
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={product.image?.url || product.media_gallery?.[0]?.url || '/placeholder-tour.jpg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                    {/* Price Badge */}
                                    <div className="absolute top-4 right-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white px-4 py-2 rounded-full font-semibold shadow-xl text-sm">
                                        ${product.price_range.maximum_price.final_price.value.toFixed(2)}
                                    </div>
                                </div>

                                {/* Product Details */}
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors line-clamp-2">
                                        {product.name}
                                    </h3>

                                    {/* Book Now Button */}
                                    <div className="mt-auto">
                                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-full font-semibold hover:from-sky-400 hover:to-amber-400 transform hover:scale-105 transition-all duration-300 shadow-lg">
                                            <svg
                                                className="w-4 h-4"
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
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            {canNavigate && (
                <>
                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-between mt-8">
                        <button
                            onClick={goToPrevious}
                            className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
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

                        {/* Dots Indicator */}
                        <div className="flex justify-center gap-2">
                            {Array.from({ length: totalSlides }).map((_, index) => (
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

                        <button
                            onClick={goToNext}
                            className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
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
                    </div>
                </>
            )}
        </div>
    );
}
