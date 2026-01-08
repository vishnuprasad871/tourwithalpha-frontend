import { Metadata } from 'next';
import BookingPageClient from './BookingPageClient';

export const metadata: Metadata = {
    title: 'Book Your Tour',
    description: 'Book your Nova Scotia tour experience with Alpha Travel & Tours. Easy online booking for guided tours.',
};

export default function BookingPage() {
    return <BookingPageClient />;
}
