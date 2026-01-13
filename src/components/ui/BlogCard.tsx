import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/lib/magento/blog';

interface BlogCardProps {
    post: BlogPost;
    featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
    const formattedDate = post.publish_date
        ? new Date(post.publish_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    // Get topics as array of names
    const topicNames = post.topics?.items?.map(t => t.name) || [];

    // Get short content from meta_description or truncate post_content
    const shortContent = post.meta_description ||
        (post.post_content ? post.post_content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' : null);

    if (featured) {
        return (
            <Link
                href={`/blog/${post.url_key}`}
                className="group relative overflow-hidden rounded-3xl block"
            >
                {/* Image */}
                <div className="aspect-[16/9] lg:aspect-[21/9] relative overflow-hidden">
                    {post.image ? (
                        <Image
                            src={post.image}
                            alt={post.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-amber-500 to-purple-800" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
                    {topicNames.length > 0 && (
                        <div className="flex gap-2 mb-4">
                            {topicNames.slice(0, 2).map((topic) => (
                                <span
                                    key={topic}
                                    className="px-3 py-1 bg-sky-500/80 text-white text-xs font-medium rounded-full"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    )}
                    <h2 className="text-2xl lg:text-4xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                        {post.name}
                    </h2>
                    {shortContent && (
                        <p className="text-gray-300 text-base lg:text-lg mb-4 line-clamp-2 max-w-3xl">
                            {shortContent}
                        </p>
                    )}
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                        {post.author_name && <span>By {post.author_name}</span>}
                        {formattedDate && <span>{formattedDate}</span>}
                    </div>
                </div>
            </Link>
        );
    }

    return (
        <Link
            href={`/blog/${post.url_key}`}
            className="group bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-sky-400/50 transition-all duration-300 flex flex-col h-full"
        >
            {/* Image */}
            <div className="aspect-[16/10] relative overflow-hidden">
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-amber-500" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
            </div>

            {/* Content */}
            <div className="p-5 lg:p-6 flex flex-col flex-grow">
                {topicNames.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                        {topicNames.slice(0, 2).map((topic) => (
                            <span
                                key={topic}
                                className="px-2 py-0.5 bg-sky-500/20 text-purple-400 text-xs font-medium rounded-full"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                )}

                <h3 className="text-lg lg:text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {post.name}
                </h3>

                {shortContent && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                        {shortContent}
                    </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10 mt-auto">
                    <span>{post.author_name || 'Travel Team'}</span>
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
