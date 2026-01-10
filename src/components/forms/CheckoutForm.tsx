'use client';

import { useState, useEffect } from 'react';
import { Country, getCountries, BillingAddressInput } from '@/lib/magento/graphql';

interface CheckoutFormProps {
    onSubmit: (email: string, address: BillingAddressInput) => Promise<void>;
    loading: boolean;
    onBack: () => void;
}

interface FormData {
    email: string;
    firstname: string;
    lastname: string;
    company: string;
    street1: string;
    street2: string;
    city: string;
    region: string;
    postcode: string;
    country_code: string;
    telephone: string;
}

const initialFormData: FormData = {
    email: '',
    firstname: '',
    lastname: '',
    company: '',
    street1: '',
    street2: '',
    city: '',
    region: '',
    postcode: '',
    country_code: 'US',
    telephone: '',
};

export default function CheckoutForm({ onSubmit, loading, onBack }: CheckoutFormProps) {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [countries, setCountries] = useState<Country[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    useEffect(() => {
        async function fetchCountries() {
            setLoadingCountries(true);
            const countryList = await getCountries();
            // Sort countries alphabetically by name
            countryList.sort((a, b) => a.full_name_english.localeCompare(b.full_name_english));
            setCountries(countryList);
            setLoadingCountries(false);
        }
        fetchCountries();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.firstname) newErrors.firstname = 'First name is required';
        if (!formData.lastname) newErrors.lastname = 'Last name is required';
        if (!formData.street1) newErrors.street1 = 'Street address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.postcode) newErrors.postcode = 'Postal code is required';
        if (!formData.country_code) newErrors.country_code = 'Country is required';
        if (!formData.telephone) newErrors.telephone = 'Phone number is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const address: BillingAddressInput = {
            firstname: formData.firstname,
            lastname: formData.lastname,
            company: formData.company || undefined,
            street: [formData.street1, formData.street2].filter(Boolean),
            city: formData.city,
            region: formData.region || undefined,
            postcode: formData.postcode,
            country_code: formData.country_code,
            telephone: formData.telephone,
        };

        await onSubmit(formData.email, address);
    };

    const inputClasses = (hasError: boolean) =>
        `w-full px-4 py-3 bg-white/5 border ${hasError ? 'border-red-500' : 'border-white/10'
        } rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Guest Email Section */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                </h3>
                <div>
                    <label className="block text-sm text-gray-400 mb-2">Email Address *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className={inputClasses(!!errors.email)}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>
            </div>

            {/* Billing Address Section */}
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Billing Address
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* First Name */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">First Name *</label>
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            placeholder="John"
                            className={inputClasses(!!errors.firstname)}
                        />
                        {errors.firstname && <p className="mt-1 text-sm text-red-400">{errors.firstname}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Last Name *</label>
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            placeholder="Doe"
                            className={inputClasses(!!errors.lastname)}
                        />
                        {errors.lastname && <p className="mt-1 text-sm text-red-400">{errors.lastname}</p>}
                    </div>

                    {/* Company */}
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Company (Optional)</label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your Company"
                            className={inputClasses(false)}
                        />
                    </div>

                    {/* Street Address 1 */}
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Street Address *</label>
                        <input
                            type="text"
                            name="street1"
                            value={formData.street1}
                            onChange={handleChange}
                            placeholder="123 Main Street"
                            className={inputClasses(!!errors.street1)}
                        />
                        {errors.street1 && <p className="mt-1 text-sm text-red-400">{errors.street1}</p>}
                    </div>

                    {/* Street Address 2 */}
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Apt, Suite, etc. (Optional)</label>
                        <input
                            type="text"
                            name="street2"
                            value={formData.street2}
                            onChange={handleChange}
                            placeholder="Apartment 4B"
                            className={inputClasses(false)}
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">City *</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Los Angeles"
                            className={inputClasses(!!errors.city)}
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city}</p>}
                    </div>

                    {/* State/Region */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">State/Region</label>
                        <input
                            type="text"
                            name="region"
                            value={formData.region}
                            onChange={handleChange}
                            placeholder="California"
                            className={inputClasses(false)}
                        />
                    </div>

                    {/* Postal Code */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Postal Code *</label>
                        <input
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleChange}
                            placeholder="90210"
                            className={inputClasses(!!errors.postcode)}
                        />
                        {errors.postcode && <p className="mt-1 text-sm text-red-400">{errors.postcode}</p>}
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Country *</label>
                        <select
                            name="country_code"
                            value={formData.country_code}
                            onChange={handleChange}
                            disabled={loadingCountries}
                            className={`${inputClasses(!!errors.country_code)} ${loadingCountries ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loadingCountries ? (
                                <option>Loading countries...</option>
                            ) : (
                                countries.map(country => (
                                    <option key={country.id} value={country.two_letter_abbreviation}>
                                        {country.full_name_english}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.country_code && <p className="mt-1 text-sm text-red-400">{errors.country_code}</p>}
                    </div>

                    {/* Phone */}
                    <div className="md:col-span-2">
                        <label className="block text-sm text-gray-400 mb-2">Phone Number *</label>
                        <input
                            type="tel"
                            name="telephone"
                            value={formData.telephone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className={inputClasses(!!errors.telephone)}
                        />
                        {errors.telephone && <p className="mt-1 text-sm text-red-400">{errors.telephone}</p>}
                    </div>
                </div>
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
                    disabled={loading || loadingCountries}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>Continue to Payment →</>
                    )}
                </button>
            </div>
        </form>
    );
}
