'use client';

import Link from 'next/link';

interface OrderSuccessPageProps {
    orderNumber: string;
}

export default function OrderSuccessPage({ orderNumber }: OrderSuccessPageProps) {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                {/* Success Icon with Animation */}
                <div className="mb-8 relative">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center animate-bounce-slow">
                        <svg
                            className="w-12 h-12 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    {/* Celebration particles */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping delay-100"></div>
                        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-200"></div>
                        <div className="absolute bottom-0 right-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping delay-300"></div>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                    Booking Confirmed!
                </h1>
                <p className="text-gray-300 mb-6">
                    Thank you for your booking. We&apos;ve sent a confirmation email with all the details.
                </p>

                {/* Order Number */}
                <div className="p-6 bg-white/5 rounded-xl border border-white/10 mb-8">
                    <p className="text-gray-400 text-sm mb-2">Your Booking Number</p>
                    <p className="text-2xl font-bold gradient-text">{orderNumber}</p>
                </div>

                {/* What's Next */}
                <div className="p-6 bg-sky-400/10 border border-sky-400/20 rounded-xl mb-8 text-left">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        What&apos;s Next?
                    </h3>
                    <ul className="text-gray-300 text-sm space-y-2">
                        <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Check your email for booking confirmation
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Save your booking number for reference
                        </li>
                        <li className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            We&apos;ll contact you with tour details
                        </li>
                    </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all text-center"
                    >
                        ← Back to Home
                    </Link>
                    <Link
                        href="/booking"
                        className="px-6 py-3 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-full font-semibold hover:from-sky-400 hover:to-amber-400 transition-all text-center"
                    >
                        Book Another Tour
                    </Link>
                </div>
            </div>

            {/* Add custom animation styles */}
            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-10px);
                    }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
