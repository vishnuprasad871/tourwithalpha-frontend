import Link from 'next/link';

interface BannerProps {
    heading: string;
    subheading?: string;
    buttonText?: string;
    buttonLink?: string;
    backgroundImage?: string;
    overlay?: boolean;
    size?: 'hero' | 'medium' | 'small';
}

export default function Banner({
    heading,
    subheading,
    buttonText,
    buttonLink,
    backgroundImage,
    overlay = true,
    size = 'hero',
}: BannerProps) {
    const sizeClasses = {
        hero: 'min-h-[80vh] lg:min-h-screen',
        medium: 'min-h-[50vh] lg:min-h-[60vh]',
        small: 'min-h-[30vh] lg:min-h-[40vh]',
    };

    return (
        <section
            className={`relative ${sizeClasses[size]} flex items-center justify-center overflow-hidden`}
        >
            {/* Background */}
            {backgroundImage ? (
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900" />
            )}

            {/* Animated Background Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Overlay */}
            {overlay && <div className="absolute inset-0 bg-black/50" />}

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
                    {heading.split(' ').map((word, i) => (
                        <span key={i}>
                            {i % 3 === 1 ? (
                                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    {word}{' '}
                                </span>
                            ) : (
                                <span>{word} </span>
                            )}
                        </span>
                    ))}
                </h1>

                {subheading && (
                    <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
                        {subheading}
                    </p>
                )}

                {buttonText && buttonLink && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
                        <Link
                            href={buttonLink}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-500/25"
                        >
                            {buttonText}
                        </Link>
                        <Link
                            href="/about"
                            className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all duration-300"
                        >
                            Learn More
                        </Link>
                    </div>
                )}
            </div>

            {/* Scroll Indicator */}
            {size === 'hero' && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                        <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
                    </div>
                </div>
            )}
        </section>
    );
}

// Promo Banner Card Component
interface PromoBannerProps {
    title: string;
    description: string;
    image?: string;
    link: string;
}

export function PromoBanner({ title, description, image, link }: PromoBannerProps) {
    return (
        <Link
            href={link}
            className="group relative overflow-hidden rounded-2xl block h-64 lg:h-80"
        >
            {/* Background */}
            {image ? (
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${image})` }}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-300 text-sm lg:text-base">{description}</p>
                <span className="mt-4 inline-flex items-center text-purple-400 font-medium group-hover:gap-3 transition-all">
                    Explore
                    <svg
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </span>
            </div>
        </Link>
    );
}
