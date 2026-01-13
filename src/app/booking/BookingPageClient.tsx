'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ImageGallery from '@/components/ui/ImageGallery';
import { Product, CustomizableOptionInput, BookingAvailability } from '@/lib/magento/graphql';
import {
    getProductByUrlKey,
    addToCart,
    getCartId,
    initializeFreshCart,
    setGuestEmailOnCart,
    setBillingAddressOnCart,
    BillingAddressInput,
    setPaymentMethodOnCart,
    placeOrder,
    getCartTotals,
    CartTotals,
    clearCartId,
    getBookingAvailability,
} from '@/lib/magento/graphql';
import CheckoutForm from '@/components/forms/CheckoutForm';
import PaymentMethodSelector from '@/components/forms/PaymentMethodSelector';
import OrderSummary from '@/components/ui/OrderSummary';
import OrderSuccessPage from '@/components/ui/OrderSuccessPage';
import ProductOptionsForm, { SelectedOption, DateAvailabilityInfo } from '@/components/forms/ProductOptionsForm';

type CheckoutStep = 'product' | 'checkout' | 'payment' | 'review' | 'success';

interface BookingPageClientProps {
    urlKey: string;
}

interface BookingState {
    product: Product | null;
    loading: boolean;
    error: string | null;
    quantity: number;
    cartLoading: boolean;
    grandTotal: number | null;
    cartId: string | null;
    step: CheckoutStep;
    cartTotals: CartTotals | null;
    orderNumber: string | null;
    selectedOptions: SelectedOption[];
    bookingAvailability: BookingAvailability | null;
    dateAvailability: DateAvailabilityInfo | null;
}

// Step indicator component
function StepIndicator({ currentStep }: { currentStep: CheckoutStep }) {
    const steps = [
        { key: 'product', label: 'Select Tour', icon: '1' },
        { key: 'checkout', label: 'Your Details', icon: '2' },
        { key: 'payment', label: 'Payment', icon: '3' },
        { key: 'review', label: 'Review', icon: '4' },
    ];

    const getCurrentIndex = () => {
        if (currentStep === 'success') return 4;
        return steps.findIndex(s => s.key === currentStep);
    };

    const currentIndex = getCurrentIndex();

    if (currentStep === 'success') return null;

    return (
        <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
                <div key={step.key} className="flex items-center">
                    <div className="flex flex-col items-center">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${index < currentIndex
                                ? 'bg-green-500 text-white'
                                : index === currentIndex
                                    ? 'bg-gradient-to-r from-sky-500 to-amber-500 text-white'
                                    : 'bg-white/10 text-gray-400'
                                }`}
                        >
                            {index < currentIndex ? (
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                step.icon
                            )}
                        </div>
                        <span className={`text-xs mt-2 hidden sm:block ${index <= currentIndex ? 'text-white' : 'text-gray-500'
                            }`}>
                            {step.label}
                        </span>
                    </div>
                    {index < steps.length - 1 && (
                        <div
                            className={`w-12 sm:w-24 h-0.5 mx-2 ${index < currentIndex ? 'bg-green-500' : 'bg-white/10'
                                }`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export default function BookingPageClient({ urlKey }: BookingPageClientProps) {
    const [state, setState] = useState<BookingState>({
        product: null,
        loading: true,
        error: null,
        quantity: 1,
        cartLoading: false,
        grandTotal: null,
        cartId: null,
        step: 'product',
        cartTotals: null,
        orderNumber: null,
        selectedOptions: [],
        bookingAvailability: null,
        dateAvailability: null,
    });

    // Initialize fresh cart and fetch product on mount
    useEffect(() => {
        async function initialize() {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                // Create a fresh cart (clears old one)
                const newCartId = await initializeFreshCart();

                // Fetch product using dynamic urlKey
                const product = await getProductByUrlKey(urlKey);

                if (product) {
                    // Fetch booking availability
                    const availability = await getBookingAvailability(product.sku);

                    setState((prev) => ({
                        ...prev,
                        product,
                        loading: false,
                        cartId: newCartId,
                        bookingAvailability: availability,
                    }));
                } else {
                    setState((prev) => ({
                        ...prev,
                        loading: false,
                        error: 'Product not found',
                        cartId: newCartId,
                    }));
                }
            } catch {
                setState((prev) => ({
                    ...prev,
                    loading: false,
                    error: 'Failed to load product',
                }));
            }
        }
        initialize();
    }, [urlKey]);

    const handleQuantityChange = (delta: number) => {
        setState((prev) => ({
            ...prev,
            quantity: Math.max(1, prev.quantity + delta),
        }));
    };

    const handleOptionsChange = useCallback((selectedOptions: SelectedOption[]) => {
        setState((prev) => ({
            ...prev,
            selectedOptions,
        }));
    }, []);

    const handleAvailabilityChange = useCallback((info: DateAvailabilityInfo | null) => {
        setState((prev) => ({
            ...prev,
            dateAvailability: info,
        }));
    }, []);

    const handleBookNow = async () => {
        if (!state.product) return;

        // Validate required options
        const requiredOptions = state.product.options?.filter(opt => opt.required) || [];
        const missingRequired = requiredOptions.filter(opt =>
            !state.selectedOptions.some(sel => sel.option_id === opt.option_id)
        );

        if (missingRequired.length > 0) {
            setState((prev) => ({
                ...prev,
                error: `Please fill in required fields: ${missingRequired.map(o => o.title).join(', ')}`,
            }));
            return;
        }

        // Validate seat availability
        if (state.dateAvailability && state.quantity > state.dateAvailability.remainingSeats) {
            setState((prev) => ({
                ...prev,
                error: `Only ${state.dateAvailability?.remainingSeats} seat(s) available for this date. Please reduce the quantity.`,
            }));
            return;
        }

        setState((prev) => ({ ...prev, cartLoading: true, error: null }));

        try {
            const cartId = state.cartId || getCartId();

            if (!cartId) {
                throw new Error('Cart not initialized. Please refresh the page.');
            }

            // Convert selected options to cart format
            const customizableOptions: CustomizableOptionInput[] = state.selectedOptions.map(opt => ({
                id: opt.option_id,
                value_string: opt.value_date || opt.value_string || '',
            }));

            // Add to cart with customizable options
            const cart = await addToCart(cartId, state.product.sku, state.quantity, customizableOptions);

            if (cart) {
                setState((prev) => ({
                    ...prev,
                    cartLoading: false,
                    grandTotal: cart.prices.grand_total.value,
                    step: 'checkout', // Move to checkout step
                }));
            } else {
                throw new Error('Failed to add booking');
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                cartLoading: false,
                error: error instanceof Error ? error.message : 'An error occurred',
            }));
        }
    };

    const handleCheckoutSubmit = async (email: string, address: BillingAddressInput) => {
        if (!state.cartId) return;

        setState((prev) => ({ ...prev, cartLoading: true, error: null }));

        try {
            // Set guest email
            await setGuestEmailOnCart(state.cartId, email);

            // Set billing address
            await setBillingAddressOnCart(state.cartId, address);

            // Move to payment step
            setState((prev) => ({
                ...prev,
                cartLoading: false,
                step: 'payment',
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                cartLoading: false,
                error: error instanceof Error ? error.message : 'Failed to save details',
            }));
        }
    };

    const handlePaymentSelect = async (paymentMethodCode: string) => {
        if (!state.cartId) return;

        setState((prev) => ({ ...prev, cartLoading: true, error: null }));

        try {
            // Set payment method
            await setPaymentMethodOnCart(state.cartId, paymentMethodCode);

            // Fetch cart totals for review
            const totals = await getCartTotals(state.cartId);

            setState((prev) => ({
                ...prev,
                cartLoading: false,
                cartTotals: totals,
                step: 'review',
            }));
        } catch (error) {
            setState((prev) => ({
                ...prev,
                cartLoading: false,
                error: error instanceof Error ? error.message : 'Failed to set payment method',
            }));
        }
    };

    const handlePlaceOrder = async () => {
        if (!state.cartId) return;

        setState((prev) => ({ ...prev, cartLoading: true, error: null }));

        try {
            // Place order
            const orderNumber = await placeOrder(state.cartId);

            if (orderNumber) {
                // Clear cart from localStorage
                clearCartId();

                setState((prev) => ({
                    ...prev,
                    cartLoading: false,
                    orderNumber,
                    step: 'success',
                    cartId: null,
                }));
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                cartLoading: false,
                error: error instanceof Error ? error.message : 'Failed to place order',
            }));
        }
    };

    const goBack = () => {
        const stepOrder: CheckoutStep[] = ['product', 'checkout', 'payment', 'review'];
        const currentIndex = stepOrder.indexOf(state.step);
        if (currentIndex > 0) {
            setState((prev) => ({ ...prev, step: stepOrder[currentIndex - 1], error: null }));
        }
    };

    const price = state.product?.price_range.maximum_price.final_price;
    const totalPrice = price ? price.value * state.quantity : 0;

    // Success state
    if (state.step === 'success' && state.orderNumber) {
        return <OrderSuccessPage orderNumber={state.orderNumber} />;
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 lg:py-32 bg-gradient-to-br from-sky-900 via-slate-900 to-amber-900 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
                        Book Your <span className="gradient-text">Tour</span>
                    </h1>
                    <p className="text-xl text-gray-300 animate-fade-in delay-200">
                        Experience the beauty of Nova Scotia
                    </p>
                </div>
            </section>

            {/* Booking Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-b from-slate-900 to-black">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Step Indicator */}
                    <StepIndicator currentStep={state.step} />

                    {state.loading ? (
                        <div className="glass rounded-2xl p-8 lg:p-12">
                            <div className="animate-pulse">
                                <div className="aspect-video bg-white/10 rounded-xl mb-6" />
                                <div className="h-8 bg-white/10 rounded w-3/4 mb-4" />
                                <div className="h-4 bg-white/10 rounded w-full mb-2" />
                                <div className="h-4 bg-white/10 rounded w-2/3" />
                            </div>
                        </div>
                    ) : state.error && !state.product ? (
                        <div className="glass rounded-2xl p-8 lg:p-12 text-center">
                            <p className="text-red-400">{state.error}</p>
                        </div>
                    ) : state.product ? (
                        <div className="glass rounded-2xl overflow-hidden">
                            {/* Product Selection Step */}
                            {state.step === 'product' && (
                                <>
                                    {/* Product Image/Gallery */}
                                    {state.product.media_gallery && state.product.media_gallery.length > 1 ? (
                                        <ImageGallery
                                            images={state.product.media_gallery}
                                            productName={state.product.name}
                                        />
                                    ) : (
                                        <div className="relative aspect-video lg:aspect-[21/9]">
                                            {state.product.image?.url ? (
                                                <Image
                                                    src={state.product.image.url}
                                                    alt={state.product.name}
                                                    fill
                                                    className="object-cover"
                                                    priority
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-amber-500" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            <div className="absolute bottom-6 left-6 right-6">
                                                <h2 className="text-2xl lg:text-4xl font-bold text-white">
                                                    {state.product.name}
                                                </h2>
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Details */}
                                    <div className="p-6 lg:p-8">
                                        {/* Description */}
                                        {state.product.short_description?.html && (
                                            <div
                                                className="prose prose-invert max-w-none mb-8 text-gray-300"
                                                dangerouslySetInnerHTML={{
                                                    __html: state.product.short_description.html,
                                                }}
                                            />
                                        )}

                                        {/* Customizable Product Options */}
                                        {state.product.options && state.product.options.length > 0 && (
                                            <div className="mb-8">
                                                <ProductOptionsForm
                                                    options={state.product.options}
                                                    onChange={handleOptionsChange}
                                                    bookingAvailability={state.bookingAvailability}
                                                    quantity={state.quantity}
                                                    onAvailabilityChange={handleAvailabilityChange}
                                                />
                                            </div>
                                        )}

                                        {/* Price and Quantity - hide for enquiry-only products */}
                                        {!state.product.enquiry_only && (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 bg-white/5 rounded-xl border border-white/10">
                                                <div>
                                                    <p className="text-gray-400 text-sm mb-1">Price per person</p>
                                                    <p className="text-3xl font-bold text-white">
                                                        {price && (
                                                            <>
                                                                <span className="gradient-text">
                                                                    ${price.value.toFixed(2)}
                                                                </span>
                                                                <span className="text-gray-500 text-lg ml-2">
                                                                    {price.currency}
                                                                </span>
                                                            </>
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Quantity Selector */}
                                                <div className="flex items-center gap-4">
                                                    <span className="text-gray-400">Quantity:</span>
                                                    <div className="flex items-center bg-white/10 rounded-full">
                                                        <button
                                                            onClick={() => handleQuantityChange(-1)}
                                                            disabled={state.quantity <= 1}
                                                            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-12 text-center text-white font-semibold">
                                                            {state.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleQuantityChange(1)}
                                                            className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Total and Book Now / Enquire Now */}
                                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                            {!state.product.enquiry_only && (
                                                <div>
                                                    <p className="text-gray-400 text-sm">Total</p>
                                                    <p className="text-2xl font-bold gradient-text">
                                                        ${totalPrice.toFixed(2)}
                                                    </p>
                                                </div>
                                            )}

                                            {state.product.enquiry_only ? (
                                                /* Enquire Now Button - redirects to contact page */
                                                <button
                                                    onClick={() => {
                                                        const message = encodeURIComponent(`I need to know more about "${state.product?.name}"`);
                                                        window.location.href = `/contact?message=${message}`;
                                                    }}
                                                    className="
                                                        px-8 py-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-full font-semibold text-lg
                                                        hover:from-sky-400 hover:to-amber-400 
                                                        transform hover:scale-105 transition-all duration-300
                                                        shadow-xl shadow-sky-400/25
                                                        flex items-center gap-2
                                                    "
                                                >
                                                    <svg
                                                        className="w-5 h-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                        />
                                                    </svg>
                                                    Enquire Now
                                                </button>
                                            ) : (
                                                /* Book Now Button */
                                                <button
                                                    onClick={handleBookNow}
                                                    disabled={state.cartLoading || state.product.stock_status !== 'IN_STOCK'}
                                                    className="
                                                        px-8 py-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-full font-semibold text-lg
                                                        hover:from-sky-400 hover:to-amber-400 
                                                        disabled:opacity-50 disabled:cursor-not-allowed
                                                        transform hover:scale-105 transition-all duration-300
                                                        shadow-xl shadow-sky-400/25
                                                        flex items-center gap-2
                                                    "
                                                >
                                                    {state.cartLoading ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin h-5 w-5"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <circle
                                                                    className="opacity-25"
                                                                    cx="12"
                                                                    cy="12"
                                                                    r="10"
                                                                    stroke="currentColor"
                                                                    strokeWidth="4"
                                                                    fill="none"
                                                                />
                                                                <path
                                                                    className="opacity-75"
                                                                    fill="currentColor"
                                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                />
                                                            </svg>
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            Book Now - ${totalPrice.toFixed(2)}
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        {/* Error Message */}
                                        {state.error && (
                                            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                                                {state.error}
                                            </div>
                                        )}

                                        {/* Stock Status */}
                                        {state.product.stock_status !== 'IN_STOCK' && (
                                            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400">
                                                This tour is currently unavailable
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* Checkout Form Step */}
                            {state.step === 'checkout' && (
                                <div className="p-6 lg:p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Your Details</h2>
                                    <CheckoutForm
                                        onSubmit={handleCheckoutSubmit}
                                        loading={state.cartLoading}
                                        onBack={goBack}
                                    />
                                    {state.error && (
                                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                                            {state.error}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Payment Method Step */}
                            {state.step === 'payment' && state.cartId && (
                                <div className="p-6 lg:p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Payment Method</h2>
                                    <PaymentMethodSelector
                                        cartId={state.cartId}
                                        onSelect={handlePaymentSelect}
                                        onBack={goBack}
                                        loading={state.cartLoading}
                                    />
                                    {state.error && (
                                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                                            {state.error}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Review Step */}
                            {state.step === 'review' && state.cartTotals && (
                                <div className="p-6 lg:p-8">
                                    <h2 className="text-2xl font-bold text-white mb-6">Review Your Booking</h2>
                                    <OrderSummary
                                        cartTotals={state.cartTotals}
                                        onPlaceOrder={handlePlaceOrder}
                                        onBack={goBack}
                                        loading={state.cartLoading}
                                    />
                                    {state.error && (
                                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                                            {state.error}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
