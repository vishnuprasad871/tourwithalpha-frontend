import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Our Services',
    description: 'Alpha Travel & Tours offers Nova Scotia Tours, Group Charter, Golf Tours, Airport Transfers, and Wedding Transportation services.',
};

const services = [
    {
        icon: '🏔️',
        title: 'Nova Scotia Tours',
        description: 'Explore the stunning beauty and rich culture of Nova Scotia with Alpha Travel & Tours, offering fully customized group tours tailored to your interests. Whether it\'s scenic coastlines, historic sites, or local flavors, we\'ll craft the perfect itinerary for an unforgettable experience.',
        features: ['Customized itineraries', 'Scenic coastlines', 'Historic sites', 'Local culinary experiences'],
    },
    {
        icon: '🚌',
        title: 'Group Charter',
        description: 'Whether you\'re planning a family outing, a corporate retreat, or a friends\' adventure, we\'ll create the perfect itinerary for you. From breathtaking coastal views to hidden gems, experience the best of Nova Scotia on your terms.',
        features: ['Family outings', 'Corporate retreats', 'Friends adventures', 'Custom routes'],
    },
    {
        icon: '⛳',
        title: 'Golf Tours',
        description: 'Tee off in style with Alpha Travel & Tours, offering customized golf tours across Nova Scotia\'s finest courses. Whether you\'re a seasoned golfer or a casual player, we\'ll design the perfect golfing experience just for you.',
        features: ['Premier golf courses', 'Equipment transport', 'Flexible scheduling', 'Group packages'],
    },
    {
        icon: '✈️',
        title: 'Airport Transfers',
        description: 'Enjoy stress-free airport transfers with Alpha Travel & Tours, ensuring a smooth and comfortable ride to your destination. Whether you\'re arriving or departing, our reliable service guarantees a hassle-free experience from start to finish.',
        features: ['Halifax Stanfield Airport', 'Meet & greet service', 'Flight monitoring', 'Comfortable vehicles'],
    },
    {
        icon: '💒',
        title: 'Weddings',
        description: 'Make your special day unforgettable with Alpha Travel & Tours, offering tailored transportation and travel services for weddings. From guest shuttles to scenic tours for your wedding party, we\'ll ensure every detail is perfect for your celebration.',
        features: ['Guest shuttles', 'Wedding party transport', 'Scenic photo tours', 'Decorated vehicles'],
    },
];

export default function ServicesPage() {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                        Our <span className="gradient-text">Services</span>
                    </h1>
                    <p className="text-xl text-gray-300 animate-fade-in delay-200">
                        From group tours to airport transfers, we make your Nova Scotia journey seamless and memorable
                    </p>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`glass rounded-2xl p-8 lg:p-12 flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'
                                    } gap-8 lg:gap-12 items-center`}
                            >
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-5xl lg:text-6xl">
                                        {service.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-grow text-center lg:text-left">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                                        {service.title}
                                    </h2>
                                    <p className="text-gray-300 leading-relaxed mb-6">
                                        {service.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                                        {service.features.map((feature, fIndex) => (
                                            <span
                                                key={fIndex}
                                                className="px-3 py-1 bg-purple-600/20 text-purple-400 text-sm font-medium rounded-full"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                            Ready to Book Your Experience?
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            Contact us today to plan your perfect Nova Scotia adventure. We&apos;ll create a customized
                            experience tailored to your needs.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/booking"
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/25"
                            >
                                Book Now
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                            >
                                Contact Us
                            </Link>
                        </div>
                        <p className="mt-6 text-gray-400">
                            📞 (902) 449-2478 • 📧 info@tourwithalpha.com
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
