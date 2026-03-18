'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  fetchBookings, 
  deleteBooking, 
  saveBooking, 
  logoutAdmin, 
  fetchProducts,
  OfflineSales, 
  OfflineSalesSearchResults,
  ProductListItem
} from '@/lib/magento/rest';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';
import BookingTable from '@/components/admin/BookingTable';
import BookingForm from '@/components/admin/BookingForm';

export default function AdminBookingsPage() {
  const [data, setData] = useState<OfflineSalesSearchResults | null>(null);
  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<OfflineSales | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bookingsResults, productsResults] = await Promise.all([
        fetchBookings(),
        fetchProducts()
      ]);
      setData(bookingsResults);
      setProducts(productsResults);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to load booking data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateOrUpdate = async (formData: any) => {
    setActionLoading(true);
    try {
      const bookingToSave = editingBooking ? { ...formData, id: editingBooking.id } : formData;
      await saveBooking(bookingToSave);
      await loadData();
      setEditingBooking(null);
      setIsAdding(false);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    
    setActionLoading(true);
    try {
      await deleteBooking(id);
      await loadData();
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete booking.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    router.push('/admin/login');
  };

  return (
    <AdminAuthGuard>
      <div className="min-h-screen bg-gray-50 pb-12">
        {/* Admin Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500 text-center">Manage Offline Bookings</p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">×</button>
            </div>
          )}

          {/* Actions Bar */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Offline Bookings ({data?.total_count || 0})
            </h2>
            <button
              onClick={() => {
                setEditingBooking(null);
                setIsAdding(!isAdding);
              }}
              className="px-4 py-2 bg-[#fcd34d] hover:bg-[#fbbf24] text-black font-semibold rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-[#fcd34d] focus:ring-offset-1"
            >
              {isAdding ? 'Close Form' : 'Add New Booking'}
            </button>
          </div>

          {/* Form Section */}
          {(isAdding || editingBooking) && (
            <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
              <BookingForm 
                initialData={editingBooking}
                products={products}
                onSubmit={handleCreateOrUpdate}
                onCancel={() => {
                  setIsAdding(false);
                  setEditingBooking(null);
                }}
                loading={actionLoading}
              />
            </div>
          )}

          {/* Grid Section */}
          <BookingTable 
            bookings={data?.items || []}
            products={products}
            onEdit={(b) => {
              setEditingBooking(b);
              setIsAdding(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onDelete={handleDelete}
            loading={loading}
          />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
