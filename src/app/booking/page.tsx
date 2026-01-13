import { redirect } from 'next/navigation';

// Redirect /booking to /booking/nova-scotia-tours
export default function BookingPage() {
    redirect('/booking/nova-scotia-tours');
}
