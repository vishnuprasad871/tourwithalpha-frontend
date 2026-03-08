import { Metadata } from 'next';
import ReviewsSection from '@/components/ui/ReviewsSection';

export const metadata: Metadata = {
    title: 'About Us | Locally Owned Small-Group Nova Scotia Tour Company',
    description:
        'Alpha Travel & Tours is a locally owned tour company based in Halifax, Nova Scotia. We specialize in premium small-group day tours for cruise passengers and independent travelers. Quality over quantity — every time.',
    alternates: { canonical: '/about' },
    openGraph: {
        title: 'About Alpha Travel & Tours — Halifax Nova Scotia',
        description:
            'Locally owned and operated in Halifax. Small-group tours to Peggy\'s Cove, Lunenburg & Titanic Cemetery. 5-star rated, cruise-friendly scheduling.',
        url: '/about',
    },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-gradient-to-br from-sky-900 via-slate-900 to-amber-900 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                        Who <span className="gradient-text">We Are</span>
                    </h1>
                    <p className="text-xl text-gray-300 animate-fade-in delay-200">
                        Locally owned small-group Nova Scotia tours from Halifax
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {/* Our Story */}
                        <div className="glass rounded-2xl p-8 lg:p-12">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                                Our Story
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Alpha Travel &amp; Tours is a locally owned tour company based in Halifax, Nova Scotia.
                                We specialize in premium small-group experiences designed for cruise passengers and
                                independent travelers who want a relaxed, well-organized, and informative journey
                                through Atlantic Canada.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                Our signature full-day tour visits Peggy&apos;s Cove Lighthouse, the UNESCO World Heritage
                                town of Lunenburg, and the historic Fairview Lawn Cemetery &mdash; the final resting place
                                of Titanic victims recovered in 1912. We focus on quality over quantity, maintaining
                                small groups to ensure every guest feels comfortable, valued, and never rushed.
                            </p>
                        </div>

                        {/* Our Mission */}
                        <div className="glass rounded-2xl p-8 lg:p-12">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                                Our Mission
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-4">
                                Nova Scotia is more than just scenic coastlines — it&apos;s maritime heritage, fishing
                                communities, historic architecture, and oceanfront landscapes shaped by centuries of
                                history. At Alpha Travel &amp; Tours, we bring these stories to life through thoughtful
                                storytelling and well-paced itineraries.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                From the dramatic granite shoreline of Peggy&apos;s Cove to the colorful waterfront of
                                Lunenburg, our tours are designed to showcase the very best of Atlantic Canada in a
                                single seamless day — without ever feeling rushed.
                            </p>
                        </div>

                        {/* Our Services */}
                        <div className="glass rounded-2xl p-8 lg:p-12">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                                What We Offer
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    {
                                        icon: '🏔️',
                                        title: 'Nova Scotia Tours',
                                        desc: 'Fully customized group tours tailored to your interests'
                                    },
                                    {
                                        icon: '🚌',
                                        title: 'Group Charter',
                                        desc: 'Perfect for family outings, corporate retreats, and adventures'
                                    },
                                    {
                                        icon: '⛳',
                                        title: 'Golf Tours',
                                        desc: 'Customized tours across Nova Scotia\'s finest courses'
                                    },
                                    {
                                        icon: '✈️',
                                        title: 'Airport Transfers',
                                        desc: 'Stress-free, smooth and comfortable rides'
                                    },
                                    {
                                        icon: '💒',
                                        title: 'Wedding Transportation',
                                        desc: 'Guest shuttles and scenic tours for your special day'
                                    },
                                    {
                                        icon: '🎯',
                                        title: 'Custom Itineraries',
                                        desc: 'Personalized experiences designed just for you'
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <span className="text-2xl">{item.icon}</span>
                                        <div>
                                            <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                                            <p className="text-gray-400 text-sm">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Designed for Cruise Passengers */}
                        <div className="glass rounded-2xl p-8 lg:p-12">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                                🚢 Designed for Cruise Passengers
                            </h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                We understand cruise schedules and port logistics. Our tours depart directly from
                                the Halifax cruise terminal area and are timed according to ship arrival and
                                departure. We monitor cruise schedules to ensure a completely stress-free experience.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                {[
                                    { icon: '📍', title: 'Port Pickup', desc: 'Direct departure from Halifax cruise terminal' },
                                    { icon: '⏱️', title: 'Schedule Monitoring', desc: 'We track your ship arrivals and departures' },
                                    { icon: '✅', title: 'Guaranteed Return', desc: 'Always back at port before your ship departs' },
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center text-center p-4 bg-white/5 rounded-xl border border-white/10">
                                        <span className="text-3xl mb-3">{item.icon}</span>
                                        <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                                        <p className="text-gray-400 text-sm">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="col-span-full">
                            <ReviewsSection maxReviews={6} showFilters={false} />
                        </div>

                        {/* Contact Info */}
                        <div className="glass rounded-2xl p-8 lg:p-12 text-center">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                                Get in Touch
                            </h2>
                            <div className="space-y-4">
                                <p className="text-gray-300">
                                    <span className="text-2xl mr-2">📍</span>
                                    Dartmouth, NS B3A4V9
                                </p>
                                <p className="text-gray-300">
                                    <span className="text-2xl mr-2">📧</span>
                                    <a href="mailto:info@tourwithalpha.com" className="text-purple-400 hover:text-purple-300">
                                        info@tourwithalpha.com
                                    </a>
                                </p>
                                <p className="text-gray-300">
                                    <span className="text-2xl mr-2">📞</span>
                                    <a href="tel:9024492478" className="text-purple-400 hover:text-purple-300">
                                        (902) 449-2478
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


