import { Metadata } from 'next';
import { Suspense } from 'react';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
    title: 'Contact Us | Alpha Travel & Tours — Halifax, Nova Scotia',
    description:
        'Get in touch with Alpha Travel & Tours to book your Nova Scotia small-group tour or ask about cruise excursions from Halifax. Email info@tourwithalpha.com or call (902) 449-2478.',
    alternates: { canonical: '/contact' },
    openGraph: {
        title: 'Contact Alpha Travel & Tours — Halifax Nova Scotia',
        description: 'Book your tour or ask about cruise excursions. Call (902) 449-2478 or email info@tourwithalpha.com.',
        url: '/contact',
    },
};

export default function ContactPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-900 to-black" />}>
            <ContactPageClient />
        </Suspense>
    );
}
