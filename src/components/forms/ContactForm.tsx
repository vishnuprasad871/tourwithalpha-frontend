'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { submitContactForm } from '@/lib/magento/contact';

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional(),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
    defaultMessage?: string;
}

export default function ContactForm({ defaultMessage }: ContactFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            message: defaultMessage || '',
        },
    });

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const result = await submitContactForm(data);
            setSubmitResult(result);
            if (result.success) {
                reset();
            }
        } catch {
            setSubmitResult({ success: false, message: 'An error occurred. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
            transition-all duration-200
            ${errors.name ? 'border-red-500' : 'border-white/10 hover:border-white/20'}
          `}
                    placeholder="John Doe"
                />
                {errors.name && (
                    <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>
                )}
            </div>

            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address *
                </label>
                <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
            transition-all duration-200
            ${errors.email ? 'border-red-500' : 'border-white/10 hover:border-white/20'}
          `}
                    placeholder="john@example.com"
                />
                {errors.email && (
                    <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>
                )}
            </div>

            {/* Phone Field */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                    type="tel"
                    id="phone"
                    {...register('phone')}
                    className="
            w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
            hover:border-white/20 transition-all duration-200
          "
                    placeholder="+1 (555) 000-0000"
                />
            </div>

            {/* Message Field */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Your Message *
                </label>
                <textarea
                    id="message"
                    rows={5}
                    {...register('message')}
                    className={`
            w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent
            transition-all duration-200 resize-none
            ${errors.message ? 'border-red-500' : 'border-white/10 hover:border-white/20'}
          `}
                    placeholder="Tell us about your travel plans or ask any questions..."
                />
                {errors.message && (
                    <p className="mt-2 text-sm text-red-400">{errors.message.message}</p>
                )}
            </div>

            {/* Submit Result */}
            {submitResult && (
                <div
                    className={`p-4 rounded-xl ${submitResult.success
                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                        }`}
                >
                    <p className="flex items-center gap-2">
                        {submitResult.success ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        )}
                        {submitResult.message}
                    </p>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isSubmitting}
                className="
          w-full py-4 bg-gradient-to-r from-sky-500 to-amber-500 text-white rounded-xl font-semibold
          hover:from-sky-400 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 focus:ring-offset-slate-900
          disabled:opacity-50 disabled:cursor-not-allowed
          transform hover:scale-[1.02] transition-all duration-200
          shadow-lg shadow-sky-400/25
        "
            >
                {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Sending...
                    </span>
                ) : (
                    'Send Message'
                )}
            </button>
        </form>
    );
}
