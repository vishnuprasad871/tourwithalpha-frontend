import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getBlogPost, getRelatedPosts } from '@/lib/magento/blog';
import BlogCard from '@/components/ui/BlogCard';

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    return {
        title: post.meta_title || post.name,
        description: post.meta_description || post.post_content?.replace(/<[^>]*>/g, '').substring(0, 160),
        openGraph: {
            title: post.name,
            description: post.meta_description || post.post_content?.replace(/<[^>]*>/g, '').substring(0, 160),
            images: post.image ? [{ url: post.image }] : [],
            type: 'article',
            publishedTime: post.publish_date,
            authors: post.author_name ? [post.author_name] : [],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) {
        notFound();
    }

    // Get related posts using the API
    const relatedPosts = await getRelatedPosts(post.post_id, 3);

    const formattedDate = post.publish_date
        ? new Date(post.publish_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
        : null;

    // Get topics as array of names
    const topicNames = post.topics?.items?.map(t => t.name) || [];

    return (
        <article className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 overflow-hidden">
                {/* Background Image or Gradient */}
                {post.image ? (
                    <div className="absolute inset-0">
                        <Image
                            src={post.image}
                            alt={post.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-900 via-slate-900 to-amber-900" />
                )}
                <div className="absolute inset-0 bg-black/60" />

                {/* Animated Orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <ol className="flex items-center gap-2 text-sm">
                            <li>
                                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li>
                                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li className="text-gray-500">/</li>
                            <li className="text-sky-400 truncate max-w-[200px]">{post.name}</li>
                        </ol>
                    </nav>

                    {/* Topics */}
                    {topicNames.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {topicNames.map((topic) => (
                                <span
                                    key={topic}
                                    className="px-3 py-1 bg-sky-500/80 text-white text-sm font-medium rounded-full"
                                >
                                    {topic}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 animate-fade-in">
                        {post.name}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-gray-300">
                        {post.author_name && (
                            <span className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-amber-500 flex items-center justify-center text-white font-semibold">
                                    {post.author_name.charAt(0)}
                                </div>
                                {post.author_name}
                            </span>
                        )}
                        {formattedDate && (
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {formattedDate}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div
                        className="prose prose-lg prose-invert max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-2xl prose-h2:lg:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-xl prose-h3:lg:text-2xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
              prose-li:text-gray-300
              prose-a:text-sky-400 prose-a:no-underline hover:prose-a:text-sky-300
              prose-strong:text-white
              prose-blockquote:border-l-sky-500 prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-xl
              prose-img:rounded-xl prose-img:shadow-xl"
                        dangerouslySetInnerHTML={{ __html: post.post_content }}
                    />

                    {/* Share Buttons */}
                    <div className="mt-12 pt-8 border-t border-white/10">
                        <h3 className="text-white font-semibold mb-4">Share this article</h3>
                        <div className="flex gap-3">
                            {['Twitter', 'Facebook', 'LinkedIn'].map((platform) => (
                                <button
                                    key={platform}
                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-sky-500/50 transition-all"
                                >
                                    {platform}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className="py-16 lg:py-24 bg-black">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-8">
                            Related <span className="gradient-text">Articles</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPosts.map((relatedPost) => (
                                <BlogCard key={relatedPost.post_id} post={relatedPost} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </article>
    );
}
