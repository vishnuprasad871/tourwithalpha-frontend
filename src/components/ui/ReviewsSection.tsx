'use client';

import { useState } from 'react';
import Link from 'next/link';
import { reviews, platformData } from '@/lib/reviews-data';
import ReviewCard from './ReviewCard';

type FilterType = 'all' | 'tripadvisor' | 'viator';

interface ReviewsSectionProps {
    maxReviews?: number;
    showFilters?: boolean;
}

export default function ReviewsSection({
    maxReviews = 6,
    showFilters = true
}: ReviewsSectionProps) {
    const [filter, setFilter] = useState<FilterType>('all');

    const filteredReviews = reviews.filter((review) => {
        if (filter === 'all') return true;
        return review.platform === filter;
    });

    const displayedReviews = filteredReviews.slice(0, maxReviews);

    // Calculate overall rating
    const totalRating = platformData.tripadvisor.overallRating + platformData.viator.overallRating;
    const avgRating = (totalRating / 2).toFixed(1);
    const totalReviewCount = platformData.tripadvisor.totalReviews + platformData.viator.totalReviews;

    return (
        <section className="py-16 lg:py-24 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        What Our <span className="gradient-text">Guests Say</span>
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">
                        Don&apos;t just take our word for it - hear from travelers who&apos;ve experienced Nova Scotia with us
                    </p>

                    {/* Overall Rating */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="flex items-center gap-2">
                            <span className="text-4xl font-bold text-amber-400">{avgRating}</span>
                            <div>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-amber-400 text-xl">★</span>
                                    ))}
                                </div>
                                <p className="text-gray-500 text-sm">{totalReviewCount} reviews</p>
                            </div>
                        </div>
                    </div>

                    {/* Platform Filter Tabs */}
                    {showFilters && (
                        <div className="flex items-center justify-center gap-2 flex-wrap">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filter === 'all'
                                        ? 'bg-gradient-to-r from-sky-500 to-amber-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                All Reviews
                            </button>
                            <button
                                onClick={() => setFilter('tripadvisor')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filter === 'tripadvisor'
                                        ? 'bg-gradient-to-r from-sky-500 to-amber-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                🏆 TripAdvisor
                            </button>
                            <button
                                onClick={() => setFilter('viator')}
                                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${filter === 'viator'
                                        ? 'bg-gradient-to-r from-sky-500 to-amber-500 text-white'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                ⭐ Viator
                            </button>
                        </div>
                    )}
                </div>

                {/* Reviews Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {displayedReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href={platformData.tripadvisor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300 font-semibold"
                    >
                        <span>🏆</span>
                        See Reviews on TripAdvisor
                        <span className="text-sm opacity-75">→</span>
                    </Link>
                    <Link
                        href={platformData.viator.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300 font-semibold"
                    >
                        <span>⭐</span>
                        See Reviews on Viator
                        <span className="text-sm opacity-75">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
