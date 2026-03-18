'use client';

import { OfflineSales } from '@/lib/magento/rest';

interface BookingTableProps {
  bookings: OfflineSales[];
  onEdit: (booking: OfflineSales) => void;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function BookingTable({ bookings, onEdit, onDelete, loading }: BookingTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#fcd34d]"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <p className="text-gray-500">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Booking Date
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Qty
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Notes
            </th>
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
                {booking.sku}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {booking.booking_date}
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
                <button
                  onClick={() => onEdit(booking)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => booking.id && onDelete(booking.id)}
                  className="text-red-600 hover:text-red-900 transition-colors"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
