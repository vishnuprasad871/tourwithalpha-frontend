import { magentoClient, safeFetch } from './client';
import { endpoints, Seat, BookingRequest, BookingResponse } from './config';

// Mock seats for fallback
const mockSeats: Seat[] = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    number: `${Math.floor(i / 6) + 1}${String.fromCharCode(65 + (i % 6))}`,
    status: Math.random() > 0.3 ? 'available' : 'booked',
    price: 50,
}));

let bookedSeats: number[] = [];

export async function getAvailableSeats(): Promise<Seat[]> {
    const { data, error } = await safeFetch(
        () => magentoClient.get<Seat[]>(endpoints.seats),
        []
    );

    if (data?.length) return data;

    // Fallback to mock data
    if (error) {
        console.log('Using mock seats data');
        return mockSeats.map(seat => ({
            ...seat,
            status: bookedSeats.includes(seat.id) ? 'booked' : seat.status,
        }));
    }

    return [];
}

export async function createBooking(request: BookingRequest): Promise<BookingResponse> {
    const { data, error } = await safeFetch(
        () => magentoClient.post<BookingResponse>(endpoints.bookings, request),
        { success: false, message: 'Booking failed' }
    );

    if (data?.success) return data;

    // Fallback to mock booking
    if (error) {
        console.log('Using mock booking');
        // Simulate booking
        bookedSeats = [...bookedSeats, ...request.seats];
        return {
            success: true,
            bookingId: `BK${Date.now()}`,
            message: 'Booking confirmed successfully!',
        };
    }

    return { success: false, message: 'Booking failed' };
}

export function validateSeatSelection(seats: number[], maxSeats: number = 4): { valid: boolean; message: string } {
    if (seats.length === 0) {
        return { valid: false, message: 'Please select at least one seat' };
    }

    if (seats.length > maxSeats) {
        return { valid: false, message: `You can select maximum ${maxSeats} seats` };
    }

    return { valid: true, message: '' };
}
