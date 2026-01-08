import { Metadata } from 'next';
import { getAvailableSeats } from '@/lib/magento/booking';
import BookingPageClient from './BookingPageClient';

export const metadata: Metadata = {
    title: 'Book Your Seats',
    description: 'Select and book your seats for an unforgettable tour experience with Tour With Alpha.',
};

export default async function BookingPage() {
    const seats = await getAvailableSeats();

    return <BookingPageClient initialSeats={seats} />;
}
