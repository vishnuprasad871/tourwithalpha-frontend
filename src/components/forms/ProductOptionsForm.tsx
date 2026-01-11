'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    CustomizableOption,
    CustomizableOptionValue,
    BookingAvailability,
    getAvailabilityForDate,
} from '@/lib/magento/graphql';

export interface SelectedOption {
    option_id: number;
    value_string?: string;
    value_date?: string;
}

export interface DateAvailabilityInfo {
    date: string;
    remainingSeats: number;
    allowedSeats: number;
}

interface ProductOptionsFormProps {
    options: CustomizableOption[];
    onChange: (selectedOptions: SelectedOption[]) => void;
    bookingAvailability?: BookingAvailability | null;
    quantity: number;
    onAvailabilityChange?: (info: DateAvailabilityInfo | null) => void;
}

function hasValues(
    option: CustomizableOption
): option is CustomizableOption & { value: CustomizableOptionValue[] } {
    return 'value' in option && Array.isArray(option.value);
}

// Helper to format date as 'Y-m-d H:i:s' for Magento
function formatDateForMagento(dateString: string): string {
    if (!dateString) return '';
    // Input is 'YYYY-MM-DD', output should be 'YYYY-MM-DD HH:mm:ss'
    return `${dateString} 00:00:00`;
}

// Known option IDs for conditional logic (based on the API response)
const CRUISE_SHIP_OPTION_TITLE = 'Are you Coming in Cruise Ship?';
const SHIP_ARRIVAL_TITLE = 'Ship Arrival TIme';
const SHIP_DEPARTURE_TITLE = 'Ship Departure TIme';
const DATE_OPTION_TITLE = 'Tour Date';
const YES_VALUE_TITLE = 'YES';

export default function ProductOptionsForm({
    options,
    onChange,
    bookingAvailability,
    quantity,
    onAvailabilityChange,
}: ProductOptionsFormProps) {
    const [selectedOptions, setSelectedOptions] = useState<Record<number, string>>({});
    const [selectedDateAvailability, setSelectedDateAvailability] = useState<DateAvailabilityInfo | null>(null);

    // Sort options by sort_order
    const sortedOptions = useMemo(() =>
        [...options].sort((a, b) => a.sort_order - b.sort_order),
        [options]
    );

    // Find the date option
    const dateOption = useMemo(() =>
        sortedOptions.find(opt => opt.title === DATE_OPTION_TITLE),
        [sortedOptions]
    );

    // Find the cruise ship option and its "YES" value
    const cruiseShipOption = useMemo(() =>
        sortedOptions.find(opt => opt.title === CRUISE_SHIP_OPTION_TITLE),
        [sortedOptions]
    );

    const yesValueId = useMemo(() => {
        if (cruiseShipOption && hasValues(cruiseShipOption)) {
            const yesValue = cruiseShipOption.value.find(v => v.title === YES_VALUE_TITLE);
            return yesValue ? String(yesValue.option_type_id) : null;
        }
        return null;
    }, [cruiseShipOption]);

    // Check if cruise ship is selected as YES
    const isCruiseShipYes = useMemo(() => {
        if (!cruiseShipOption || !yesValueId) return false;
        return selectedOptions[cruiseShipOption.option_id] === yesValueId;
    }, [cruiseShipOption, yesValueId, selectedOptions]);

    // Options that should be conditionally hidden
    const conditionalOptionTitles = [SHIP_ARRIVAL_TITLE, SHIP_DEPARTURE_TITLE];

    // Handle date selection and check availability
    const handleDateChange = useCallback((optionId: number, dateValue: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [optionId]: dateValue,
        }));

        if (dateValue) {
            // Always calculate availability - getAvailabilityForDate handles null/empty cases
            const availability = getAvailabilityForDate(bookingAvailability ?? null, dateValue);
            const info: DateAvailabilityInfo = {
                date: dateValue,
                remainingSeats: availability.remaining,
                allowedSeats: availability.allowed,
            };
            setSelectedDateAvailability(info);
            onAvailabilityChange?.(info);
        } else {
            setSelectedDateAvailability(null);
            onAvailabilityChange?.(null);
        }
    }, [bookingAvailability, onAvailabilityChange]);

    useEffect(() => {
        // Convert selected options to the format expected by Magento
        const formattedOptions: SelectedOption[] = Object.entries(selectedOptions)
            .filter(([, value]) => value !== '')
            .map(([optionId, value]) => {
                const option = options.find((o) => o.option_id === Number(optionId));
                if (option?.__typename === 'CustomizableDateOption') {
                    return {
                        option_id: Number(optionId),
                        value_date: formatDateForMagento(value),
                    };
                }
                return {
                    option_id: Number(optionId),
                    value_string: value,
                };
            });
        onChange(formattedOptions);
    }, [selectedOptions, options, onChange]);

    const handleOptionChange = (optionId: number, value: string) => {
        setSelectedOptions((prev) => ({
            ...prev,
            [optionId]: value,
        }));
    };

    const shouldShowOption = (option: CustomizableOption): boolean => {
        // If this is a ship arrival/departure time field, only show when cruise ship = YES
        if (conditionalOptionTitles.includes(option.title)) {
            return isCruiseShipYes;
        }
        return true;
    };

    // Check if selected quantity exceeds available seats
    const isQuantityExceeded = selectedDateAvailability && quantity > selectedDateAvailability.remainingSeats;

    const renderOption = (option: CustomizableOption) => {
        // Check if option should be visible
        if (!shouldShowOption(option)) {
            return null;
        }

        const { option_id, title, required, __typename } = option;

        switch (__typename) {
            case 'CustomizableRadioOption':
            case 'CustomizableDropDownOption': {
                if (!hasValues(option)) return null;
                const values = option.value.sort((a, b) => a.sort_order - b.sort_order);

                if (__typename === 'CustomizableRadioOption') {
                    return (
                        <div key={option_id} className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">
                                {title} {required && <span className="text-amber-400">*</span>}
                            </label>
                            <div className="space-y-2">
                                {values.map((val) => (
                                    <label
                                        key={val.option_type_id}
                                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${selectedOptions[option_id] === String(val.option_type_id)
                                            ? 'border-sky-400 bg-sky-400/10'
                                            : 'border-white/10 hover:border-white/20 bg-white/5'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name={`option_${option_id}`}
                                            value={val.option_type_id}
                                            checked={selectedOptions[option_id] === String(val.option_type_id)}
                                            onChange={(e) => handleOptionChange(option_id, e.target.value)}
                                            className="sr-only"
                                        />
                                        <div
                                            className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${selectedOptions[option_id] === String(val.option_type_id)
                                                ? 'border-sky-400'
                                                : 'border-gray-500'
                                                }`}
                                        >
                                            {selectedOptions[option_id] === String(val.option_type_id) && (
                                                <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                                            )}
                                        </div>
                                        <span className="text-white flex-1">{val.title}</span>
                                        {val.price > 0 && (
                                            <span className="text-gray-400 text-sm">
                                                +${val.price.toFixed(2)}
                                            </span>
                                        )}
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                }

                // Dropdown
                return (
                    <div key={option_id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            {title} {required && <span className="text-amber-400">*</span>}
                        </label>
                        <select
                            value={selectedOptions[option_id] || ''}
                            onChange={(e) => handleOptionChange(option_id, e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent hover:border-white/20 transition-all duration-200"
                        >
                            <option value="" className="bg-slate-900">
                                Select {title}
                            </option>
                            {values.map((val) => (
                                <option
                                    key={val.option_type_id}
                                    value={val.option_type_id}
                                    className="bg-slate-900"
                                >
                                    {val.title}
                                    {val.price > 0 ? ` (+$${val.price.toFixed(2)})` : ''}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            }

            case 'CustomizableCheckboxOption':
            case 'CustomizableMultipleOption': {
                if (!hasValues(option)) return null;
                const values = option.value.sort((a, b) => a.sort_order - b.sort_order);
                const selectedIds = selectedOptions[option_id]?.split(',').filter(Boolean) || [];

                const handleCheckboxChange = (valueId: string, checked: boolean) => {
                    let newSelected: string[];
                    if (checked) {
                        newSelected = [...selectedIds, valueId];
                    } else {
                        newSelected = selectedIds.filter((id) => id !== valueId);
                    }
                    handleOptionChange(option_id, newSelected.join(','));
                };

                return (
                    <div key={option_id} className="space-y-3">
                        <label className="block text-sm font-medium text-gray-300">
                            {title} {required && <span className="text-amber-400">*</span>}
                        </label>
                        <div className="space-y-2">
                            {values.map((val) => (
                                <label
                                    key={val.option_type_id}
                                    className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all duration-200 ${selectedIds.includes(String(val.option_type_id))
                                        ? 'border-sky-400 bg-sky-400/10'
                                        : 'border-white/10 hover:border-white/20 bg-white/5'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(String(val.option_type_id))}
                                        onChange={(e) =>
                                            handleCheckboxChange(String(val.option_type_id), e.target.checked)
                                        }
                                        className="sr-only"
                                    />
                                    <div
                                        className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${selectedIds.includes(String(val.option_type_id))
                                            ? 'border-sky-400 bg-sky-400'
                                            : 'border-gray-500'
                                            }`}
                                    >
                                        {selectedIds.includes(String(val.option_type_id)) && (
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-white flex-1">{val.title}</span>
                                    {val.price > 0 && (
                                        <span className="text-gray-400 text-sm">
                                            +${val.price.toFixed(2)}
                                        </span>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>
                );
            }

            case 'CustomizableDateOption': {
                const selectedDate = selectedOptions[option_id] || '';
                const isDateOption = title === DATE_OPTION_TITLE;

                return (
                    <div key={option_id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            {title} {required && <span className="text-amber-400">*</span>}
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => {
                                    if (isDateOption) {
                                        handleDateChange(option_id, e.target.value);
                                    } else {
                                        handleOptionChange(option_id, e.target.value);
                                    }
                                }}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 bg-slate-800 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent hover:border-white/20 transition-all duration-200 appearance-none cursor-pointer [color-scheme:dark]"
                                style={{ colorScheme: 'dark' }}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Show availability info for the Date field */}
                        {isDateOption && selectedDate && selectedDateAvailability && (
                            <div className={`mt-3 p-4 rounded-xl border ${isQuantityExceeded
                                ? 'bg-red-500/10 border-red-500/20'
                                : selectedDateAvailability.remainingSeats <= 3
                                    ? 'bg-yellow-500/10 border-yellow-500/20'
                                    : 'bg-green-500/10 border-green-500/20'
                                }`}>
                                <div className="flex items-center gap-2">
                                    {isQuantityExceeded ? (
                                        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    <div>
                                        <p className={`font-medium ${isQuantityExceeded
                                            ? 'text-red-400'
                                            : selectedDateAvailability.remainingSeats <= 3
                                                ? 'text-yellow-400'
                                                : 'text-green-400'
                                            }`}>
                                            {isQuantityExceeded
                                                ? `Only ${selectedDateAvailability.remainingSeats} seat${selectedDateAvailability.remainingSeats !== 1 ? 's' : ''} available!`
                                                : `${selectedDateAvailability.remainingSeats} seat${selectedDateAvailability.remainingSeats !== 1 ? 's' : ''} available`
                                            }
                                        </p>
                                        {isQuantityExceeded && (
                                            <p className="text-sm text-red-300 mt-1">
                                                Please reduce quantity to {selectedDateAvailability.remainingSeats} or less
                                            </p>
                                        )}
                                        {!isQuantityExceeded && selectedDateAvailability.remainingSeats <= 3 && (
                                            <p className="text-sm text-yellow-300 mt-1">
                                                Limited seats - Book now!
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );
            }

            case 'CustomizableFieldOption':
                return (
                    <div key={option_id} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                            {title} {required && <span className="text-amber-400">*</span>}
                        </label>
                        <input
                            type="text"
                            value={selectedOptions[option_id] || ''}
                            onChange={(e) => handleOptionChange(option_id, e.target.value)}
                            placeholder={`Enter ${title.toLowerCase()}`}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent hover:border-white/20 transition-all duration-200"
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    if (sortedOptions.length === 0) {
        return null;
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Tour Options</h3>
            {sortedOptions.map((option) => renderOption(option))}
        </div>
    );
}
