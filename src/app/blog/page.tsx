import { Metadata } from 'next';
import BlogCard from '@/components/ui/BlogCard';
import { getBlogPosts } from '@/lib/magento/blog';

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Explore travel tips, destination guides, and inspiration for your next adventure on the Tour With Alpha blog.',
};

export default async function BlogPage() {
    const { posts, total } = await getBlogPosts(1, 10);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-gradient-to-br from-sky-900 via-slate-900 to-amber-900 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                        Travel <span className="gradient-text">Blog</span>
                    </h1>
                    <p className="text-xl text-gray-300 animate-fade-in delay-200">
                        Tips, guides, and inspiration for your next adventure
                    </p>
                </div>
            </section>

            {/* Blog Listing */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {posts.length > 0 ? (
                        <>
                            {/* Featured Post */}
                            {posts[0] && (
                                <div className="mb-12">
                                    <BlogCard post={posts[0]} featured />
                                </div>
                            )}

                            {/* Post Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                {posts.slice(1).map((post) => (
                                    <BlogCard key={post.post_id} post={post} />
                                ))}
                            </div>

                            {/* Pagination Info */}
                            <div className="mt-12 text-center">
                                <p className="text-gray-400">
                                    Showing {posts.length} of {total} posts
                                </p>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📝</div>
                            <h2 className="text-2xl font-bold text-white mb-2">No Posts Yet</h2>
                            <p className="text-gray-400">
                                Check back soon for travel tips and inspiration!
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
