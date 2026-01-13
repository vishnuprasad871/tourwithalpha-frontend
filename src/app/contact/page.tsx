import { Metadata } from 'next';
import { Suspense } from 'react';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Contact Alpha Travel & Tours to plan your next Nova Scotia adventure. Email info@tourwithalpha.com or call (902) 449-2478.',
};

export default function ContactPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gradient-to-b from-slate-900 to-black" />}>
            <ContactPageClient />
        </Suspense>
    );
}
