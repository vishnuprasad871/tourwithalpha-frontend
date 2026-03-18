import { Review } from '@/lib/reviews-data';

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const platformBadge = review.platform === 'tripadvisor' ? '🏆 TripAdvisor' : '⭐ Viator';
    const platformColor = review.platform === 'tripadvisor' ? 'text-green-400' : 'text-orange-400';

    return (
        <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-sky-400/50 transition-all duration-300 group h-full flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold ${platformColor}`}>
                            {platformBadge}
                        </span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <span
                                key={i}
                                className={`text-lg ${i < review.rating ? 'text-amber-400' : 'text-gray-600'
                                    }`}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Review Title */}
            {review.title && (
                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-purple-400 transition-colors">
                    {review.title}
                </h3>
            )}

            {/* Review Text */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4 flex-1">
                &ldquo;{review.text}&rdquo;
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between text-sm pt-4 border-t border-white/5">
                <div>
                    <p className="text-white font-semibold">{review.author}</p>
                    {review.location && (
                        <p className="text-gray-500 text-xs">{review.location}</p>
                    )}
                </div>
                <p className="text-gray-500 text-xs">
                    {new Date(review.date).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric',
                    })}
                </p>
            </div>
        </div>
    );
}
