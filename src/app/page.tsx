import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Banner from '@/components/ui/Banner';
import BlogCard from '@/components/ui/BlogCard';
import BookingSlider from '@/components/ui/BookingSlider';
import ReviewsSection from '@/components/ui/ReviewsSection';
import GoogleReviewsSection from '@/components/ui/GoogleReviewsSection';
import { getFeaturedPosts } from '@/lib/magento/blog';
import { getBookingProducts, getGalleryFolders } from '@/lib/magento/graphql';

export const metadata: Metadata = {
  title: 'Small-Group Nova Scotia Tours | Peggy\'s Cove, Lunenburg & Titanic Cemetery',
  description:
    "Book Alpha Travel & Tours' signature full-day small-group tour from Halifax. Visit Peggy's Cove Lighthouse, UNESCO Lunenburg & the Titanic Fairview Cemetery. $150/person — cruise-friendly, port pickup, free cancellation.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Alpha Travel & Tours | Nova Scotia Small-Group Day Tours from Halifax',
    description:
      "Peggy's Cove, Lunenburg & Titanic Cemetery — $150/person. Locally owned, cruise-friendly, small groups. Book direct at tourwithalpha.com.",
    url: '/',
  },
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



// Features data
const features = [
  {
    icon: '🏠',
    title: 'Locally Owned & Operated',
    description: 'Based right here in Halifax — we know Nova Scotia inside and out.',
  },
  {
    icon: '🚢',
    title: 'Cruise-Friendly Scheduling',
    description: 'Port pickup, cruise schedule monitoring, and guaranteed return before departure.',
  },
  {
    icon: '👥',
    title: 'Small Group Tours',
    description: 'Intimate groups for a more personalized, comfortable, and flexible experience.',
  },
  {
    icon: '💰',
    title: 'Transparent Pricing',
    description: 'No hidden fees — what you see is what you pay. Best rates when booking direct.',
  },
  {
    icon: '🎓',
    title: 'Expert Local Guides',
    description: 'Professional, knowledgeable guides who bring Nova Scotia\'s stories to life.',
  },
  {
    icon: '⭐',
    title: '5-Star Guest Satisfaction',
    description: 'Consistently top-rated by guests for quality, care, and memorable experiences.',
  },
];

export default async function HomePage() {
  // Fetch featured blog posts
  const featuredPosts = await getFeaturedPosts(3);

  // Fetch booking products for slider
  const bookingProducts = await getBookingProducts();

  // Fetch gallery folders
  const galleryFolders = await getGalleryFolders();

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <Banner
        heading="Come Travel with Us"
        subheading="Small-group Nova Scotia tours from Halifax — designed for cruise passengers & independent travelers"
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

      {/* Signature Tour Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-black to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Signature Tour</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A full-day premium experience showcasing the very best of Atlantic Canada
            </p>
          </div>

          <div className="glass rounded-2xl p-8 lg:p-12 max-w-5xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-10 items-start">
              {/* Stops */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-white mb-6">Peggy&apos;s Cove, Lunenburg &amp; Titanic Cemetery</h3>
                <div className="space-y-5 mb-8">
                  {[
                    { icon: '🪨', place: "Peggy's Cove Lighthouse", desc: 'Iconic granite shoreline and world-famous lighthouse on the Atlantic coast.' },
                    { icon: '🏘️', place: 'Lunenburg', desc: 'UNESCO World Heritage town — colorful waterfront, historic architecture & maritime charm.' },
                    { icon: '🕊️', place: 'Fairview Lawn Cemetery', desc: 'Final resting place of 121 Titanic victims recovered in Halifax in 1912.' },
                  ].map((stop, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <span className="text-2xl flex-shrink-0">{stop.icon}</span>
                      <div>
                        <h4 className="text-white font-semibold">{stop.place}</h4>
                        <p className="text-gray-400 text-sm">{stop.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every itinerary is carefully timed for cruise ship arrivals with guaranteed return to port before departure.
                </p>
              </div>

              {/* Pricing */}
              <div className="flex-shrink-0 w-full lg:w-64">
                <div className="bg-gradient-to-br from-sky-500/20 to-amber-500/20 border border-sky-400/30 rounded-2xl p-6 text-center">
                  <h4 className="text-white font-bold text-lg mb-4">Tour Pricing</h4>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Direct Booking</span>
                      <span className="text-2xl font-bold text-sky-400">$150</span>
                    </div>
                    <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                      <span className="text-gray-400 text-sm">Travel Partners</span>
                      <span className="text-xl font-semibold text-gray-300">$163</span>
                    </div>
                  </div>
                  <p className="text-green-400 text-xs mb-5">✓ Free cancellation up to 24 hrs before</p>
                  <Link
                    href="/booking"
                    className="block w-full px-5 py-3 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-full font-semibold text-sm hover:from-sky-400 hover:to-amber-400 transform hover:scale-105 transition-all duration-300"
                  >
                    Book Now — Best Rate
                  </Link>
                </div>
              </div>
            </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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

      {/* Reviews Section */}
      <ReviewsSection maxReviews={6} showFilters={true} />

      {/* Google Reviews Section */}
      <GoogleReviewsSection maxReviews={7} />

      {/* Gallery Section */}
      {galleryFolders.length > 0 && (
        <section className="py-16 lg:py-24 bg-gradient-to-b from-black to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Our <span className="gradient-text">Gallery</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Explore breathtaking moments from our Nova Scotia tours and experiences
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryFolders.slice(0, 6).map((folder) => (
                <Link
                  key={folder.folder_path}
                  href={`/gallery?folder=${encodeURIComponent(folder.folder_path)}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 hover:border-sky-400/50 transition-all duration-300 block bg-slate-800/50"
                >
                  {/* Thumbnail */}
                  <div className="relative h-52 overflow-hidden">
                    {folder.main_image_url ? (
                      <Image
                        src={folder.main_image_url}
                        alt={folder.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-sky-900/40 to-slate-800">
                        <span className="text-5xl">🖼️</span>
                      </div>
                    )}
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Image count badge */}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white font-medium">
                      {folder.image_count} photos
                    </div>
                  </div>
                  {/* Folder name */}
                  <div className="p-4 flex items-center justify-between">
                    <h3 className="text-white font-semibold group-hover:text-sky-400 transition-colors">
                      {folder.name}
                    </h3>
                    <span className="text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/gallery"
                className="inline-block px-6 py-3 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 hover:border-sky-400/50 transition-all duration-300"
              >
                View Full Gallery →
              </Link>
            </div>
          </div>
        </section>
      )}

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
