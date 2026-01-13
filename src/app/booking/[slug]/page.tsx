import { Metadata } from 'next';
import BookingPageClient from '../BookingPageClient';

interface BookingPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BookingPageProps): Promise<Metadata> {
    const { slug } = await params;
    const tourName = slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return {
        title: `Book ${tourName}`,
        description: `Book your ${tourName} experience with Alpha Travel & Tours. Easy online booking for guided tours.`,
    };
}

export default async function BookingPage({ params }: BookingPageProps) {
    const { slug } = await params;
    return <BookingPageClient urlKey={slug} />;
}
