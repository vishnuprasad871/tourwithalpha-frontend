import Link from 'next/link';
import { BlogPost } from '@/lib/magento/config';

interface BlogCardProps {
    post: BlogPost;
    featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
    const formattedDate = post.publish_time
        ? new Date(post.publish_time).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    if (featured) {
        return (
            <Link
                href={`/blog/${post.identifier}`}
                className="group relative overflow-hidden rounded-3xl block"
            >
                {/* Image */}
                <div className="aspect-[16/9] lg:aspect-[21/9] relative overflow-hidden">
                    {post.featured_image ? (
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url(${post.featured_image})` }}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                    {post.categories && post.categories.length > 0 && (
                        <div className="flex gap-2 mb-4">
                            {post.categories.slice(0, 2).map((category) => (
                                <span
                                    key={category}
                                    className="px-3 py-1 bg-purple-600/80 text-white text-xs font-medium rounded-full"
                                >
                                    {category}
                                </span>
                            ))}
                        </div>
                    )}
                    <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                        {post.title}
                    </h2>
                    {post.short_content && (
                        <p className="text-gray-300 text-base lg:text-lg mb-4 line-clamp-2 max-w-3xl">
                            {post.short_content}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        {post.author && <span>By {post.author}</span>}
                        {formattedDate && <span>{formattedDate}</span>}
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/blog/${post.identifier}`}
            className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 flex flex-col h-full"
        >
            {/* Image */}
            <div className="aspect-[16/10] relative overflow-hidden">
                {post.featured_image ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url(${post.featured_image})` }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Content */}
            <div className="p-5 lg:p-6 flex flex-col flex-grow">
                {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {post.categories.slice(0, 2).map((category) => (
                            <span
                                key={category}
                                className="px-2 py-0.5 bg-purple-600/20 text-purple-400 text-xs font-medium rounded-full"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.title}
                </h3>

                {post.short_content && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                        {post.short_content}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10 mt-auto">
                    <span>{post.author || 'Travel Team'}</span>
                    <span>{formattedDate || 'Recently'}</span>
                </div>
            </div>
        </Link>
    );
}

// Blog Card Skeleton for loading states
export function BlogCardSkeleton() {
    return (
        <div className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 animate-pulse">
            <div className="aspect-[16/10] bg-white/10" />
            <div className="p-5 lg:p-6">
                <div className="flex gap-2 mb-3">
                    <div className="h-5 w-16 bg-white/10 rounded-full" />
                    <div className="h-5 w-20 bg-white/10 rounded-full" />
                </div>
                <div className="h-6 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-4 bg-white/10 rounded w-full mb-1" />
                <div className="h-4 bg-white/10 rounded w-2/3 mb-4" />
                <div className="flex justify-between pt-4 border-t border-white/10">
                    <div className="h-3 w-20 bg-white/10 rounded" />
                    <div className="h-3 w-16 bg-white/10 rounded" />
                </div>
            </div>
        </div>
    );
}
