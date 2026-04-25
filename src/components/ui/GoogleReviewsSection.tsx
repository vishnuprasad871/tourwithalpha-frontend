'use client';

import { useState } from 'react';
import { googleReviews } from '@/lib/google-reviews-data';

const GOOGLE_MAPS_URL =
    'https://www.google.com/search?q=Alpha+Travel+%26+Tours+Reviews';

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
                <svg
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-amber-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

function GoogleIcon() {
    return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
    );
}

interface Props {
    maxReviews?: number;
}

export default function GoogleReviewsSection({ maxReviews = 6 }: Props) {
    const [showAll, setShowAll] = useState(false);
    const featured = googleReviews.find((r) => r.featured);
    const rest = googleReviews.filter((r) => !r.featured);
    const displayed = showAll ? rest : rest.slice(0, maxReviews - 1);

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                        <GoogleIcon />
                        <span className="text-white font-semibold text-sm">Google Reviews</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        Trusted by <span className="gradient-text">Real Travelers</span>
                    </h2>
                    <div className="flex items-center justify-center gap-3 mt-4">
                        <span className="text-4xl font-bold text-amber-400">5.0</span>
                        <div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-gray-500 text-sm">{googleReviews.length} Google reviews</p>
                        </div>
                    </div>
                </div>

                {/* Featured review */}
                {featured && (
                    <div className="mb-8 relative">
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-gradient-to-r from-sky-500 to-amber-500 text-white text-xs font-bold rounded-full">
                            ⭐ Top Review
                        </div>
                        <div className="glass rounded-2xl p-6 lg:p-8 border border-sky-400/30">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-amber-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                        {featured.author[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold">{featured.author}</p>
                                        {featured.badge && (
                                            <p className="text-gray-500 text-xs">{featured.badge}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <StarRating rating={featured.rating} />
                                    <GoogleIcon />
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{featured.text}</p>
                        </div>
                    </div>
                )}

                {/* Rest of reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {displayed.map((review) => (
                        <div key={review.id} className="glass rounded-2xl p-6 border border-white/10 hover:border-sky-400/30 transition-all duration-300 flex flex-col">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500/60 to-amber-500/60 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                                        {review.author[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-white font-semibold text-sm">{review.author}</p>
                                        {review.badge && (
                                            <p className="text-gray-500 text-xs">{review.badge}</p>
                                        )}
                                    </div>
                                </div>
                                <GoogleIcon />
                            </div>
                            <StarRating rating={review.rating} />
                            <p className="text-gray-400 text-sm leading-relaxed mt-3 flex-grow">{review.text}</p>
                        </div>
                    ))}
                </div>

                {/* Show more / CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {!showAll && rest.length > maxReviews - 1 && (
                        <button
                            onClick={() => setShowAll(true)}
                            className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300 font-semibold"
                        >
                            Show More Reviews
                        </button>
                    )}
                    <a
                        href={GOOGLE_MAPS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300 font-semibold"
                    >
                        <GoogleIcon />
                        See All Reviews on Google
                        <span className="text-sm opacity-75">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}
