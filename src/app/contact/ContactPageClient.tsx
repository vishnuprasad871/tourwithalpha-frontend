'use client';

import { useSearchParams } from 'next/navigation';
import ContactForm from '@/components/forms/ContactForm';

export default function ContactPageClient() {
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || undefined;

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
                        Contact <span className="gradient-text">Us</span>
                    </h1>
                    <p className="text-xl text-gray-300 animate-fade-in delay-200">
                        Let us assist you in planning your next trip with Alpha Travel &amp; Tours!
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        {/* Contact Info */}
                        <div className="order-2 lg:order-1">
                            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                                Get in Touch
                            </h2>
                            <p className="text-gray-400 mb-8 leading-relaxed">
                                If you have questions about our services, want to book a tour, or need a
                                custom itinerary, feel free to contact us. We&apos;re here to help make your
                                Nova Scotia experience unforgettable!
                            </p>

                            <div className="space-y-6">
                                {/* Email */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Email</h3>
                                        <a href="mailto:info@tourwithalpha.com" className="text-gray-400 hover:text-purple-400 transition-colors">
                                            info@tourwithalpha.com
                                        </a>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Phone</h3>
                                        <a href="tel:9024492478" className="text-gray-400 hover:text-purple-400 transition-colors">
                                            (902) 449-2478
                                        </a>
                                    </div>
                                </div>

                                {/* Address */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Location</h3>
                                        <p className="text-gray-400">
                                            Dartmouth, NS B3A4V9<br />
                                            Nova Scotia, Canada
                                        </p>
                                    </div>
                                </div>

                                {/* Services Quick Links */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-amber-500 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">Our Services</h3>
                                        <ul className="text-gray-400 text-sm space-y-1">
                                            <li>• Nova Scotia Tours</li>
                                            <li>• Group Charter</li>
                                            <li>• Golf Tours</li>
                                            <li>• Airport Transfers</li>
                                            <li>• Wedding Transportation</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="order-1 lg:order-2">
                            <div className="glass rounded-2xl p-6 lg:p-8">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    Send us a Message
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    Fill out the form below and we&apos;ll get back to you as soon as possible.
                                </p>
                                <ContactForm defaultMessage={message} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
