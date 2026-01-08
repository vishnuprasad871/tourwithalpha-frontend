'use client';

import { useState, useMemo } from 'react';
import { Seat } from '@/lib/magento/config';

interface SeatSelectorProps {
    seats: Seat[];
    maxSelection?: number;
    onSelectionChange?: (selectedSeats: number[]) => void;
}

export default function SeatSelector({
    seats,
    maxSelection = 4,
    onSelectionChange,
}: SeatSelectorProps) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

    // Group seats by row
    const seatRows = useMemo(() => {
        const rows: Record<string, Seat[]> = {};
        seats.forEach((seat) => {
            const row = seat.number.replace(/[A-Z]/g, '');
            if (!rows[row]) rows[row] = [];
            rows[row].push(seat);
        });
        return Object.entries(rows).sort(([a], [b]) => Number(a) - Number(b));
    }, [seats]);

    const handleSeatClick = (seat: Seat) => {
        if (seat.status === 'booked') return;

        let newSelection: number[];

        if (selectedSeats.includes(seat.id)) {
            newSelection = selectedSeats.filter((id) => id !== seat.id);
        } else {
            if (selectedSeats.length >= maxSelection) {
                // Replace oldest selection
                newSelection = [...selectedSeats.slice(1), seat.id];
            } else {
                newSelection = [...selectedSeats, seat.id];
            }
        }

        setSelectedSeats(newSelection);
        onSelectionChange?.(newSelection);
    };

    const getSeatStatus = (seat: Seat) => {
        if (seat.status === 'booked') return 'booked';
        if (selectedSeats.includes(seat.id)) return 'selected';
        return 'available';
    };

    const statusStyles = {
        available:
            'bg-white/10 border-white/20 hover:bg-purple-600/50 hover:border-purple-500 cursor-pointer',
        selected:
            'bg-gradient-to-br from-purple-600 to-pink-600 border-purple-400 cursor-pointer shadow-lg shadow-purple-500/25',
        booked:
            'bg-gray-800/50 border-gray-700 cursor-not-allowed opacity-50',
    };

    return (
        <div className="space-y-6">
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 p-4 bg-white/5 rounded-xl">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-white/10 border border-white/20" />
                    <span className="text-sm text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-pink-600 border border-purple-400" />
                    <span className="text-sm text-gray-400">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-gray-800/50 border border-gray-700 opacity-50" />
                    <span className="text-sm text-gray-400">Booked</span>
                </div>
            </div>

            {/* Stage/Screen Indicator */}
            <div className="relative py-4">
                <div className="mx-auto w-3/4 sm:w-1/2 h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full" />
                <p className="text-center text-gray-500 text-sm mt-2">Stage / Screen</p>
            </div>

            {/* Seat Grid */}
            <div className="space-y-3">
                {seatRows.map(([row, rowSeats]) => (
                    <div key={row} className="flex items-center justify-center gap-2 sm:gap-3">
                        <span className="w-6 text-center text-gray-500 font-medium text-sm">
                            {row}
                        </span>
                        <div className="flex gap-1.5 sm:gap-2">
                            {rowSeats.map((seat, index) => (
                                <div key={seat.id} className="flex items-center">
                                    {/* Add aisle gap */}
                                    {index === Math.floor(rowSeats.length / 2) && (
                                        <div className="w-4 sm:w-8" />
                                    )}
                                    <button
                                        onClick={() => handleSeatClick(seat)}
                                        disabled={seat.status === 'booked'}
                                        className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-lg border-2 
                      flex items-center justify-center text-xs font-medium
                      transition-all duration-200 
                      ${statusStyles[getSeatStatus(seat)]}
                    `}
                                        title={`Seat ${seat.number}${seat.price ? ` - $${seat.price}` : ''}`}
                                    >
                                        <span className="text-white/80 hidden sm:block">
                                            {seat.number.replace(/^\d+/, '')}
                                        </span>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <span className="w-6 text-center text-gray-500 font-medium text-sm">
                            {row}
                        </span>
                    </div>
                ))}
            </div>

            {/* Selection Summary */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-gray-400 text-sm">Selected Seats</p>
                        <p className="text-white font-semibold">
                            {selectedSeats.length > 0
                                ? seats
                                    .filter((s) => selectedSeats.includes(s.id))
                                    .map((s) => s.number)
                                    .join(', ')
                                : 'None'}
                        </p>
                    </div>
                    <div className="text-center sm:text-right">
                        <p className="text-gray-400 text-sm">
                            {selectedSeats.length} / {maxSelection} seats
                        </p>
                        {selectedSeats.length > 0 && (
                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                $
                                {seats
                                    .filter((s) => selectedSeats.includes(s.id))
                                    .reduce((sum, s) => sum + (s.price || 0), 0)}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
