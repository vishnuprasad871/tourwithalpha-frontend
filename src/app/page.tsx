import { Metadata } from 'next';
import Link from 'next/link';
import Banner, { PromoBanner } from '@/components/ui/Banner';
import BlogCard from '@/components/ui/BlogCard';
import BookingSlider from '@/components/ui/BookingSlider';
import { getFeaturedPosts } from '@/lib/magento/blog';
import { getBookingProducts } from '@/lib/magento/graphql';

export const metadata: Metadata = {
  title: 'Alpha Travel & Tours - Nova Scotia Tours & Transportation',
  description: 'Explore Nova Scotia with Alpha Travel & Tours. We offer customized group tours, airport transfers, golf tours, wedding transportation and group charters.',
};

// Services data from tourwithalpha.com
const services = [
  {
    icon: '🏔️',
    title: 'Nova Scotia Tours',
    description: 'Explore the stunning beauty and rich culture of Nova Scotia with fully customized group tours tailored to your interests.',
    link: '/services/nova-scotia-tours',
  },
  {
    icon: '🚌',
    title: 'Group Charter',
    description: 'Planning a family outing, corporate retreat, or friends\' adventure? We\'ll create the perfect itinerary for you.',
    link: '/services/group-charter',
  },
  {
    icon: '⛳',
    title: 'Golf Tours',
    description: 'Tee off in style with customized golf tours across Nova Scotia\'s finest courses.',
    link: '/services/golf-tours',
  },
  {
    icon: '✈️',
    title: 'Airport Transfers',
    description: 'Enjoy stress-free airport transfers ensuring a smooth and comfortable ride to your destination.',
    link: '/services/airport-transfers',
  },
  {
    icon: '💒',
    title: 'Weddings',
    description: 'Make your special day unforgettable with tailored transportation and travel services for weddings.',
    link: '/services/weddings',
  },
];

// Promo banners data
const promoBanners = [
  {
    title: 'Nova Scotia Tours',
    description: 'Scenic coastlines, historic sites, and local flavors',
    image: '/images/nova-scotia.jpg',
    link: '/services/nova-scotia-tours',
  },
  {
    title: 'Golf Tours',
    description: 'Experience Nova Scotia\'s finest golf courses',
    image: '/images/golf.jpg',
    link: '/services/golf-tours',
  },
  {
    title: 'Wedding Transportation',
    description: 'Guest shuttles and scenic tours for your celebration',
    image: '/images/wedding.jpg',
    link: '/services/weddings',
  },
];

// Features data
const features = [
  {
    icon: '🌊',
    title: 'Local Expertise',
    description: 'Deep knowledge of Nova Scotia\'s best destinations and hidden gems.',
  },
  {
    icon: '🎯',
    title: 'Customized Experiences',
    description: 'Personalized itineraries tailored to your interests and schedule.',
  },
  {
    icon: '🛡️',
    title: 'Reliable Service',
    description: 'Highest standards of customer care and competitive pricing.',
  },
  {
    icon: '💎',
    title: 'Memorable Journeys',
    description: 'Creating unforgettable travel experiences since day one.',
  },
];

export default async function HomePage() {
  // Fetch featured blog posts
  const featuredPosts = await getFeaturedPosts(3);

  // Fetch booking products for slider
  const bookingProducts = await getBookingProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <Banner
        heading="Come Travel with Us"
        subheading="Explore the stunning beauty and rich culture of Nova Scotia with Alpha Travel & Tours"
        buttonText="Book Now"
        buttonLink="/booking"
        size="hero"
        backgroundImage="/banner.jpg"
      />

      {/* Booking Tours Slider */}
      {bookingProducts.length > 0 && (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Available <span className="gradient-text">Tours</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Explore our curated selection of Nova Scotia tours and experiences
              </p>
            </div>

            <BookingSlider products={bookingProducts} />

            <div className="text-center mt-8">
              <Link
                href="/booking"
                className="inline-block px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300"
              >
                View All Tours →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Services</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From group tours to airport transfers, we make your Nova Scotia journey seamless and memorable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.link}
                className="p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-sky-400/50 transition-all duration-300 group block"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 lg:py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose <span className="gradient-text">Alpha Travel</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Exceptional service, competitive pricing, and unforgettable experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 lg:p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-sky-400/50 transition-all duration-300 group text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Promo Banners Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Popular <span className="gradient-text">Experiences</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover the best of Nova Scotia with our curated experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promoBanners.map((banner, index) => (
              <PromoBanner key={index} {...banner} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-16 lg:py-24 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12 lg:mb-16">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Travel <span className="gradient-text">Tips & Stories</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Inspiration for your next Nova Scotia adventure
                </p>
              </div>
              <Link
                href="/blog"
                className="px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300"
              >
                View All Posts →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post.post_id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-sky-900/50 via-slate-900 to-amber-900/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to Explore Nova Scotia?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let us assist you in planning your next trip with Alpha Travel & Tours!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="px-8 py-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-full font-semibold text-lg hover:from-sky-400 hover:to-amber-400 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-sky-400/25"
            >
              Book Your Tour Now
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
      </section>
    </div>
  );
}
