'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SeatSelector from '@/components/ui/SeatSelector';
import { Seat, BookingResponse } from '@/lib/magento/config';
import { createBooking, validateSeatSelection } from '@/lib/magento/booking';

const bookingSchema = z.object({
    customerName: z.string().min(2, 'Name must be at least 2 characters'),
    customerEmail: z.string().email('Please enter a valid email address'),
    customerPhone: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
    selectedSeats: number[];
    seats: Seat[];
    onBookingComplete: (response: BookingResponse) => void;
}

function BookingForm({ selectedSeats, seats, onBookingComplete }: BookingFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
    });

    const selectedSeatDetails = seats.filter((s) => selectedSeats.includes(s.id));
    const totalPrice = selectedSeatDetails.reduce((sum, s) => sum + (s.price || 0), 0);

    const onSubmit = async (data: BookingFormData) => {
        const validation = validateSeatSelection(selectedSeats, 4);
        if (!validation.valid) {
            setError(validation.message);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await createBooking({
                seats: selectedSeats,
                ...data,
            });

            if (response.success) {
                onBookingComplete(response);
            } else {
                setError(response.message);
            }
        } catch {
            setError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Selected Seats Summary */}
            <div className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-xl">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Selected Seats</p>
                        <p className="text-white font-semibold">
                            {selectedSeatDetails.map((s) => s.number).join(', ')}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-sm mb-1">Total</p>
                        <p className="text-2xl font-bold gradient-text">${totalPrice}</p>
                    </div>
                </div>
            </div>

            {/* Name Field */}
            <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="customerName"
                    {...register('customerName')}
                    className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            ${errors.customerName ? 'border-red-500' : 'border-white/10 hover:border-white/20'}
          `}
                    placeholder="John Doe"
                />
                {errors.customerName && (
                    <p className="mt-2 text-sm text-red-400">{errors.customerName.message}</p>
                )}
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                </label>
                <input
                    type="email"
                    id="customerEmail"
                    {...register('customerEmail')}
                    className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            ${errors.customerEmail ? 'border-red-500' : 'border-white/10 hover:border-white/20'}
          `}
                    placeholder="john@example.com"
                />
                {errors.customerEmail && (
                    <p className="mt-2 text-sm text-red-400">{errors.customerEmail.message}</p>
                )}
            </div>

            {/* Phone Field */}
            <div>
                <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                    type="tel"
                    id="customerPhone"
                    {...register('customerPhone')}
                    className="
            w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            hover:border-white/20 transition-all duration-200
          "
                    placeholder="+1 (555) 000-0000"
                />
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting || selectedSeats.length === 0}
                className="
          w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold
          hover:from-purple-500 hover:to-pink-500 
          disabled:opacity-50 disabled:cursor-not-allowed
          transform hover:scale-[1.02] transition-all duration-200
          shadow-lg shadow-purple-500/25
        "
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                    </span>
                ) : (
                    `Confirm Booking - $${totalPrice}`
                )}
            </button>
        </form>
    );
}

export default function BookingPageClient({ initialSeats }: { initialSeats: Seat[] }) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [bookingResponse, setBookingResponse] = useState<BookingResponse | null>(null);
    const [step, setStep] = useState<'select' | 'details' | 'confirmed'>('select');

    const handleSelectionChange = (seats: number[]) => {
        setSelectedSeats(seats);
    };

    const handleProceedToDetails = () => {
        const validation = validateSeatSelection(selectedSeats, 4);
        if (validation.valid) {
            setStep('details');
        }
    };

    const handleBookingComplete = (response: BookingResponse) => {
        setBookingResponse(response);
        setStep('confirmed');
    };

    if (step === 'confirmed' && bookingResponse) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Booking Confirmed!</h1>
                    <p className="text-gray-300 mb-6">{bookingResponse.message}</p>
                    {bookingResponse.bookingId && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
                            <p className="text-gray-400 text-sm mb-1">Booking Reference</p>
                            <p className="text-2xl font-bold gradient-text">{bookingResponse.bookingId}</p>
                        </div>
                    )}
                    <button
                        onClick={() => {
                            setStep('select');
                            setSelectedSeats([]);
                            setBookingResponse(null);
                        }}
                        className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
                    >
                        Make Another Booking
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                        Book Your <span className="gradient-text">Seats</span>
                    </h1>
                    <p className="text-xl text-gray-300 animate-fade-in delay-200">
                        Select up to 4 seats for your next adventure
                    </p>
                </div>
            </section>

            {/* Booking Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Steps Indicator */}
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className={`flex items-center gap-2 ${step === 'select' ? 'text-purple-400' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'select' ? 'bg-purple-600' : 'bg-white/10'}`}>
                                1
                            </div>
                            <span className="hidden sm:block">Select Seats</span>
                        </div>
                        <div className="w-12 h-px bg-white/20" />
                        <div className={`flex items-center gap-2 ${step === 'details' ? 'text-purple-400' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'details' ? 'bg-purple-600' : 'bg-white/10'}`}>
                                2
                            </div>
                            <span className="hidden sm:block">Your Details</span>
                        </div>
                        <div className="w-12 h-px bg-white/20" />
                        <div className={`flex items-center gap-2 ${step === 'confirmed' ? 'text-purple-400' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step === 'confirmed' ? 'bg-purple-600' : 'bg-white/10'}`}>
                                3
                            </div>
                            <span className="hidden sm:block">Confirmation</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Seat Selector */}
                        <div className="lg:col-span-2">
                            <div className="glass rounded-2xl p-4 sm:p-6 lg:p-8">
                                <h2 className="text-xl font-bold text-white mb-6">
                                    {step === 'select' ? 'Select Your Seats' : 'Selected Seats'}
                                </h2>
                                <SeatSelector
                                    seats={initialSeats}
                                    maxSelection={4}
                                    onSelectionChange={handleSelectionChange}
                                />
                            </div>
                        </div>

                        {/* Booking Form / Summary */}
                        <div className="lg:col-span-1">
                            <div className="glass rounded-2xl p-6 lg:p-8 sticky top-24">
                                {step === 'select' ? (
                                    <>
                                        <h2 className="text-xl font-bold text-white mb-4">Booking Summary</h2>
                                        <div className="space-y-4 mb-6">
                                            <div className="flex justify-between text-gray-400">
                                                <span>Selected Seats</span>
                                                <span className="text-white font-medium">{selectedSeats.length}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-400">
                                                <span>Price per Seat</span>
                                                <span className="text-white font-medium">$50</span>
                                            </div>
                                            <div className="h-px bg-white/10" />
                                            <div className="flex justify-between">
                                                <span className="text-white font-semibold">Total</span>
                                                <span className="text-2xl font-bold gradient-text">
                                                    ${selectedSeats.length * 50}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleProceedToDetails}
                                            disabled={selectedSeats.length === 0}
                                            className="
                        w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold
                        hover:from-purple-500 hover:to-pink-500 
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transform hover:scale-[1.02] transition-all duration-200
                        shadow-lg shadow-purple-500/25
                      "
                                        >
                                            Continue to Details
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold text-white">Your Details</h2>
                                            <button
                                                onClick={() => setStep('select')}
                                                className="text-purple-400 text-sm hover:text-purple-300"
                                            >
                                                ← Back
                                            </button>
                                        </div>
                                        <BookingForm
                                            selectedSeats={selectedSeats}
                                            seats={initialSeats}
                                            onBookingComplete={handleBookingComplete}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
