import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getBookingProducts } from '@/lib/magento/graphql';

export const metadata: Metadata = {
    title: 'Book Your Tour - Alpha Travel & Tours',
    description: 'Browse and book our Nova Scotia tour packages. Experience the beauty and culture of Nova Scotia with Alpha Travel & Tours.',
};

export default async function BookingPage() {
    const products = await getBookingProducts();

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
                        Book Your <span className="gradient-text">Adventure</span>
                    </h1>
                    <p className="text-xl text-gray-300 animate-fade-in delay-200">
                        Choose from our curated selection of Nova Scotia tours
                    </p>
                </div>
            </section>

            {/* Products Grid Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-400 text-lg">No tours available at the moment. Please check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {products.map((product) => (
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
                                            {product.enquiry_only ? (
                                                <div className="absolute top-4 right-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white px-4 py-2 rounded-full font-semibold shadow-xl">
                                                    Enquire
                                                </div>
                                            ) : (
                                                <div className="absolute top-4 right-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white px-4 py-2 rounded-full font-semibold shadow-xl">
                                                    ${product.price_range.maximum_price.final_price.value.toFixed(2)} {product.price_range.maximum_price.final_price.currency}
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-400 transition-colors">
                                                {product.name}
                                            </h3>

                                            {/* View Details Button */}
                                            <div className="mt-auto">
                                                <div className="inline-flex items-center gap-2 text-sky-400 group-hover:text-amber-400 transition-colors font-semibold">
                                                    <span>View Details</span>
                                                    <svg
                                                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-r from-sky-900/50 via-slate-900 to-amber-900/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                        Need Help Choosing?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Our team is ready to help you plan the perfect Nova Scotia adventure!
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                        Contact Us
                    </Link>
                </div>
            </section>
        </div>
    );
}
