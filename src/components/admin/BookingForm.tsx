'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { OfflineSales, ProductListItem } from '@/lib/magento/rest';
import { useEffect } from 'react';

const bookingSchema = z.object({
  sku: z.string().min(1, 'SKU is required').max(64, 'SKU too long'),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  qty: z.number().int().min(1, 'Quantity must be at least 1'),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  initialData?: OfflineSales | null;
  products: ProductListItem[];
  onSubmit: (data: BookingFormValues) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function BookingForm({ initialData, products, onSubmit, onCancel, loading }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      sku: initialData?.sku || '',
      booking_date: initialData?.booking_date || '',
      qty: initialData?.qty || 1,
      notes: initialData?.notes || '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        sku: initialData.sku,
        booking_date: initialData.booking_date,
        qty: initialData.qty,
        notes: initialData.notes || '',
      });
    }
  }, [initialData, reset]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {initialData ? 'Edit Booking' : 'Add New Booking'}
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
            <select
              {...register('sku')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fcd34d] ${errors.sku ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Select a Product</option>
              {products.map((product) => (
                <option key={product.sku} value={product.sku}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
            {errors.sku && <p className="text-red-500 text-xs mt-1">{errors.sku.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking Date</label>
            <input
              type="date"
              {...register('booking_date')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fcd34d] ${errors.booking_date ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.booking_date && <p className="text-red-500 text-xs mt-1">{errors.booking_date.message}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              {...register('qty', { valueAsNumber: true })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#fcd34d] ${errors.qty ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.qty && <p className="text-red-500 text-xs mt-1">{errors.qty.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
            <input
              {...register('notes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fcd34d]"
              placeholder="Admin notes..."
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-black bg-[#fcd34d] rounded-md hover:bg-[#fbbf24] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Saving...' : initialData ? 'Update Booking' : 'Create Booking'}
          </button>
        </div>
      </form>
    </div>
  );
}
