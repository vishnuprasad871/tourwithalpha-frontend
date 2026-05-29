'use client';

import { OfflineSales, ProductListItem } from '@/lib/magento/rest';

interface BookingTableProps {
  bookings: OfflineSales[];
  products: ProductListItem[];
  onEdit: (booking: OfflineSales) => void;
  onDelete: (id: number) => void;
  loading: boolean;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  sortField: string;
  sortDir: 'ASC' | 'DESC';
  onSortChange: (field: string) => void;
  skuFilter: string;
  dateFilter: string;
  onSkuFilterChange: (val: string) => void;
  onDateFilterChange: (val: string) => void;
  onClearFilters: () => void;
}

const PAGE_SIZES = [10, 20, 50];

function SortIcon({ field, sortField, sortDir }: { field: string; sortField: string; sortDir: 'ASC' | 'DESC' }) {
  if (sortField !== field) return <span className="ml-1 text-gray-300 text-xs">↕</span>;
  return <span className="ml-1 text-gray-600 text-xs">{sortDir === 'ASC' ? '↑' : '↓'}</span>;
}

function getPageNumbers(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
  if (page >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  return [1, '...', page - 1, page, page + 1, '...', totalPages];
}

export default function BookingTable({
  bookings, products, onEdit, onDelete, loading,
  page, pageSize, totalCount, onPageChange, onPageSizeChange,
  sortField, sortDir, onSortChange,
  skuFilter, dateFilter, onSkuFilterChange, onDateFilterChange, onClearFilters,
}: BookingTableProps) {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);
  const hasActiveFilters = skuFilter || dateFilter;

  const thSort = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:bg-gray-100 transition-colors';
  const thPlain = 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider';

  return (
    <div className="space-y-4">
      {/* Filter / Page-size toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="w-72 shrink-0">
            <label className="block text-xs font-medium text-gray-500 mb-1">Product</label>
            <select
              value={skuFilter}
              onChange={(e) => onSkuFilterChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fcd34d] focus:border-transparent"
            >
              <option value="">All Products</option>
              {products.map(p => (
                <option key={p.sku} value={p.sku}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="w-44 shrink-0">
            <label className="block text-xs font-medium text-gray-500 mb-1">Booking Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fcd34d] focus:border-transparent"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors self-end"
            >
              Clear Filters
            </button>
          )}

          <div className="ml-auto flex items-end gap-2 shrink-0">
            <label className="text-xs font-medium text-gray-500 whitespace-nowrap pb-2.5">Rows per page</label>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="w-20 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fcd34d]"
            >
              {PAGE_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#fcd34d]"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500">No bookings found.</p>
          {hasActiveFilters && (
            <button onClick={onClearFilters} className="mt-2 text-sm text-[#fbbf24] hover:underline">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className={thSort} onClick={() => onSortChange('id')}>
                  ID <SortIcon field="id" sortField={sortField} sortDir={sortDir} />
                </th>
                <th scope="col" className={thPlain}>Product</th>
                <th scope="col" className={thSort} onClick={() => onSortChange('booking_date')}>
                  Booking Date <SortIcon field="booking_date" sortField={sortField} sortDir={sortDir} />
                </th>
                <th scope="col" className={thSort} onClick={() => onSortChange('qty')}>
                  Qty <SortIcon field="qty" sortField={sortField} sortDir={sortDir} />
                </th>
                <th scope="col" className={thPlain}>Notes</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    #{booking.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="font-medium text-gray-900">
                      {products.find(p => p.sku === booking.sku)?.name || 'Unknown Product'}
                    </div>
                    <div className="text-xs text-gray-500">{booking.sku}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(booking.booking_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.qty > 10 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {booking.qty}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {booking.notes || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onEdit(booking)} className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => booking.id && onDelete(booking.id)} className="text-red-600 hover:text-red-900 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <p className="text-sm text-gray-500">
            Showing {startItem}–{endItem} of {totalCount} bookings
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            {getPageNumbers(page, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="px-2 text-gray-400 text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => onPageChange(p as number)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    p === page
                      ? 'bg-[#fcd34d] border-[#fcd34d] text-black font-semibold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              )
            )}
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
