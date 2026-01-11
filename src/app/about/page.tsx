import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Alpha Travel & Tours - your premier transportation and tour service provider in Nova Scotia. Creating unforgettable travel experiences.',
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
                        Your premier transportation and tour service provider in Nova Scotia
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
                                At Alpha Travel & Tours, we are passionate about creating unforgettable travel
                                experiences in Nova Scotia and beyond. As a premier transportation and tour
                                service provider, we specialize in organizing personalized and group tours.
                            </p>
                            <p className="text-gray-300 leading-relaxed">
                                Our mission is to deliver exceptional service, combining competitive pricing
                                with the highest standards of customer care. Whether you&apos;re exploring the
                                stunning landscapes of Nova Scotia, planning a custom charter, or embarking
                                on an educational trip, Alpha Travel & Tours is here to make your journey
                                seamless and memorable.
                            </p>
                        </div>

                        {/* Our Mission */}
                        <div className="glass rounded-2xl p-8 lg:p-12">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                                Our Mission
                            </h2>
                            <p className="text-gray-300 leading-relaxed">
                                With a deep knowledge of the region and a commitment to excellence, we are
                                dedicated to showcasing the best of what Nova Scotia has to offer. From
                                breathtaking coastal views to hidden gems, we craft experiences that go
                                beyond ordinary travel.
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
