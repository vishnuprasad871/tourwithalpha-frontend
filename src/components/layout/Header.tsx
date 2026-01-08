'use client';

import { useState } from 'react';
import Link from 'next/link';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-purple-900/95 to-slate-900/95 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                            <span className="text-white font-bold text-xl">A</span>
                        </div>
                        <span className="text-white font-bold text-xl hidden sm:block">
                            Alpha<span className="text-purple-400">Travel</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                            </Link>
                        ))}
                        <Link
                            href="/booking"
                            className="ml-4 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-medium hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25"
                        >
                            Book Now
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {isMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                <div
                    className={`lg:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96 pb-4' : 'max-h-0'
                        }`}
                >
                    <nav className="flex flex-col space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/booking"
                            onClick={() => setIsMenuOpen(false)}
                            className="mx-4 mt-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center rounded-full font-medium"
                        >
                            Book Now
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
