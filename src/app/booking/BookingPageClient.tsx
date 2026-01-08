'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/lib/magento/graphql';
import {
    getProductByUrlKey,
    addToCart,
    getCartId,
    initializeFreshCart,
} from '@/lib/magento/graphql';

interface BookingState {
    product: Product | null;
    loading: boolean;
    error: string | null;
    quantity: number;
    cartLoading: boolean;
    success: boolean;
    grandTotal: number | null;
    cartId: string | null;
}

export default function BookingPageClient() {
    const [state, setState] = useState<BookingState>({
        product: null,
        loading: true,
        error: null,
        quantity: 1,
        cartLoading: false,
        success: false,
        grandTotal: null,
        cartId: null,
    });

    // Initialize fresh cart and fetch product on mount
    useEffect(() => {
        async function initialize() {
            setState((prev) => ({ ...prev, loading: true, error: null }));

            try {
                // Create a fresh cart (clears old one)
                const newCartId = await initializeFreshCart();

                // Fetch product
                const product = await getProductByUrlKey('nova-scotia-tours');

                if (product) {
                    setState((prev) => ({
                        ...prev,
                        product,
                        loading: false,
                        cartId: newCartId
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
    }, []);

    const handleQuantityChange = (delta: number) => {
        setState((prev) => ({
            ...prev,
            quantity: Math.max(1, prev.quantity + delta),
        }));
    };

    const handleAddToCart = async () => {
        if (!state.product) return;

        setState((prev) => ({ ...prev, cartLoading: true, error: null }));

        try {
            // Use the cart ID that was created on page load
            const cartId = state.cartId || getCartId();

            if (!cartId) {
                throw new Error('Cart not initialized. Please refresh the page.');
            }

            // Add to cart
            const cart = await addToCart(cartId, state.product.sku, state.quantity);

            if (cart) {
                setState((prev) => ({
                    ...prev,
                    cartLoading: false,
                    success: true,
                    grandTotal: cart.prices.grand_total.value,
                }));
            } else {
                throw new Error('Failed to add to cart');
            }
        } catch (error) {
            setState((prev) => ({
                ...prev,
                cartLoading: false,
                error: error instanceof Error ? error.message : 'An error occurred',
            }));
        }
    };

    const price = state.product?.price_range.maximum_price.final_price;
    const totalPrice = price ? price.value * state.quantity : 0;

    // Success state
    if (state.success) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center">
                    <div className="mb-6">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <svg
                                className="w-10 h-10 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Added to Cart!
                    </h1>
                    <p className="text-gray-300 mb-6">
                        {state.quantity}x {state.product?.name} has been added to your cart.
                    </p>
                    {state.grandTotal && (
                        <div className="p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
                            <p className="text-gray-400 text-sm mb-1">Cart Total</p>
                            <p className="text-2xl font-bold gradient-text">
                                ${state.grandTotal.toFixed(2)}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() =>
                                setState((prev) => ({
                                    ...prev,
                                    success: false,
                                    quantity: 1,
                                }))
                            }
                            className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all"
                        >
                            Continue Shopping
                        </button>
                        <a
                            href="https://tourwithalpha.shop/checkout"
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
                        >
                            Go to Checkout
                        </a>
                    </div>
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
                            {/* Product Image */}
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
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <h2 className="text-2xl lg:text-4xl font-bold text-white">
                                        {state.product.name}
                                    </h2>
                                </div>
                            </div>

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

                                {/* Price and Quantity */}
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

                                {/* Total and Add to Cart */}
                                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">Total</p>
                                        <p className="text-2xl font-bold gradient-text">
                                            ${totalPrice.toFixed(2)}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleAddToCart}
                                        disabled={state.cartLoading || state.product.stock_status !== 'IN_STOCK'}
                                        className="
                      px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg
                      hover:from-purple-500 hover:to-pink-500 
                      disabled:opacity-50 disabled:cursor-not-allowed
                      transform hover:scale-105 transition-all duration-300
                      shadow-xl shadow-purple-500/25
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
                                                Adding...
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
                                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                Add to Cart - ${totalPrice.toFixed(2)}
                                            </>
                                        )}
                                    </button>
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
                        </div>
                    ) : null}
                </div>
            </section>
        </div>
    );
}
