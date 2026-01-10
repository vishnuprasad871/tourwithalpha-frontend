'use client';

import { CartTotals } from '@/lib/magento/graphql';

interface OrderSummaryProps {
    cartTotals: CartTotals;
    onPlaceOrder: () => Promise<void>;
    onBack: () => void;
    loading: boolean;
}

export default function OrderSummary({
    cartTotals,
    onPlaceOrder,
    onBack,
    loading,
}: OrderSummaryProps) {
    const formatPrice = (value: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
        }).format(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onPlaceOrder();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Header */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Booking Summary
                </h3>
                <p className="text-gray-300">Please review your booking details before confirming.</p>
            </div>

            {/* Price Breakdown */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Price Details
                </h3>

                <div className="space-y-3">
                    {/* Subtotal */}
                    <div className="flex justify-between text-gray-300">
                        <span>Subtotal (excl. tax)</span>
                        <span>
                            {formatPrice(
                                cartTotals.prices.subtotal_excluding_tax.value,
                                cartTotals.prices.subtotal_excluding_tax.currency
                            )}
                        </span>
                    </div>

                    {/* Applied Taxes */}
                    {cartTotals.prices.applied_taxes.map((tax, index) => (
                        <div key={index} className="flex justify-between text-gray-300">
                            <span>{tax.label}</span>
                            <span>
                                {formatPrice(tax.amount.value, tax.amount.currency)}
                            </span>
                        </div>
                    ))}

                    {/* Applied Coupons */}
                    {cartTotals.applied_coupons && cartTotals.applied_coupons.length > 0 && (
                        <div className="flex justify-between text-green-400">
                            <span>Coupon: {cartTotals.applied_coupons[0].code}</span>
                            <span>Applied</span>
                        </div>
                    )}

                    {/* Divider */}
                    <div className="border-t border-white/10 my-3"></div>

                    {/* Grand Total */}
                    <div className="flex justify-between text-xl font-bold">
                        <span className="text-white">Total</span>
                        <span className="gradient-text">
                            {formatPrice(
                                cartTotals.prices.grand_total.value,
                                cartTotals.prices.grand_total.currency
                            )}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contact Info Summary */}
            {cartTotals.email && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-sm text-gray-400">Confirmation will be sent to:</p>
                    <p className="text-white font-medium">{cartTotals.email}</p>
                </div>
            )}

            {/* Terms Notice */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                <p className="text-sm text-gray-300">
                    By placing your booking, you agree to our{' '}
                    <a href="#" className="text-purple-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-purple-400 hover:underline">Privacy Policy</a>.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={loading}
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all disabled:opacity-50"
                >
                    ← Back
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-purple-500/25"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Placing Booking...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Confirm Booking
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
