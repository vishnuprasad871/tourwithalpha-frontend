'use client';

import { useState, useEffect } from 'react';
import { PaymentMethod, getAvailablePaymentMethods } from '@/lib/magento/graphql';

interface PaymentMethodSelectorProps {
    cartId: string;
    onSelect: (paymentMethodCode: string) => Promise<void>;
    onBack: () => void;
    loading: boolean;
}

export default function PaymentMethodSelector({
    cartId,
    onSelect,
    onBack,
    loading: submitting,
}: PaymentMethodSelectorProps) {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [selectedMethod, setSelectedMethod] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPaymentMethods() {
            setLoading(true);
            setError(null);
            try {
                const methods = await getAvailablePaymentMethods(cartId);
                setPaymentMethods(methods);
                if (methods.length > 0) {
                    setSelectedMethod(methods[0].code);
                }
            } catch (err) {
                setError('Failed to load payment methods. Please try again.');
                console.error(err);
            }
            setLoading(false);
        }
        fetchPaymentMethods();
    }, [cartId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMethod) return;
        await onSelect(selectedMethod);
    };

    // Payment method icons based on code
    const getPaymentIcon = (code: string) => {
        switch (code) {
            case 'checkmo':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'banktransfer':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                );
            case 'cashondelivery':
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                );
            case 'paypal_express':
            case 'paypal':
                return (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.63a.78.78 0 0 1 .769-.63h6.24c2.79 0 4.707.586 5.696 1.743.931 1.09 1.194 2.567.738 4.268l-.008.036v.632a.38.38 0 0 0 .18.323c.07.046.155.07.242.07h.062a3.95 3.95 0 0 1 2.828 1.196c.76.831 1.06 1.94.872 3.21-.387 2.596-1.68 4.417-3.84 5.413-1.067.492-2.369.746-3.869.76H12.18a.78.78 0 0 0-.77.63l-.768 4.883a.78.78 0 0 1-.769.63H7.84a.641.641 0 0 1-.633-.74l.068-.438a.38.38 0 0 0-.199-.395.38.38 0 0 0-.169-.041h-.018c-.141.008-.262.097-.304.234l-.048.158a.641.641 0 0 1-.614.462h-.847z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-flex items-center gap-3 text-gray-300">
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading payment methods...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
                >
                    ← Go Back
                </button>
            </div>
        );
    }

    if (paymentMethods.length === 0) {
        return (
            <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
                <p className="text-yellow-400 mb-4">No payment methods available for this order.</p>
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
                >
                    ← Go Back
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Select Payment Method
                </h3>

                <div className="space-y-3">
                    {paymentMethods.map((method) => (
                        <label
                            key={method.code}
                            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${selectedMethod === method.code
                                ? 'bg-purple-600/20 border-2 border-purple-500'
                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                                }`}
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value={method.code}
                                checked={selectedMethod === method.code}
                                onChange={(e) => setSelectedMethod(e.target.value)}
                                className="sr-only"
                            />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethod === method.code
                                ? 'bg-purple-500 text-white'
                                : 'bg-white/10 text-gray-400'
                                }`}>
                                {getPaymentIcon(method.code)}
                            </div>
                            <div className="flex-1">
                                <p className="text-white font-medium">{method.title}</p>
                                <p className="text-sm text-gray-400">
                                    {method.code === 'checkmo' && 'Pay by check or money order'}
                                    {method.code === 'banktransfer' && 'Direct bank transfer'}
                                    {method.code === 'cashondelivery' && 'Pay when you receive'}
                                    {method.code === 'free' && 'No payment required'}
                                    {!['checkmo', 'banktransfer', 'cashondelivery', 'free'].includes(method.code) && 'Secure payment'}
                                </p>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.code
                                ? 'border-purple-500 bg-purple-500'
                                : 'border-gray-500'
                                }`}>
                                {selectedMethod === method.code && (
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={submitting}
                    className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all disabled:opacity-50"
                >
                    ← Back
                </button>
                <button
                    type="submit"
                    disabled={submitting || !selectedMethod}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {submitting ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>Review Order →</>
                    )}
                </button>
            </div>
        </form>
    );
}
