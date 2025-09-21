import React, { useState, useMemo } from 'react';
import { RefreshCw, Calendar, Phone, Search, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { formatDateTime, getStatusBadge, getPaymentBadge } from '../utils/helpers';

const TableView = ({ bookings, services, loading, onUpdatePaymentStatus, isAdmin = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingPayment, setEditingPayment] = useState(null);
  const [updatingPayment, setUpdatingPayment] = useState(null);

  // Filter bookings based on search term
  const filteredBookings = useMemo(() => {
    if (!searchTerm) return bookings;

    const search = searchTerm.toLowerCase();
    return bookings.filter(booking => {
      const service = services.find(s => s.id === parseInt(booking.service_id));
      
      return (
        booking.customer_name.toLowerCase().includes(search) ||
        booking.phone_number.includes(search) ||
        booking.id.toString().includes(search) ||
        (service && service.name.toLowerCase().includes(search)) ||
        booking.status.toLowerCase().includes(search) ||
        booking.payment_status.toLowerCase().includes(search)
      );
    });
  }, [bookings, services, searchTerm]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  // Payment status update handlers
  const handlePaymentStatusChange = async (bookingId, newStatus) => {
    if (!onUpdatePaymentStatus) return;
    
    setUpdatingPayment(bookingId);
    try {
      await onUpdatePaymentStatus(bookingId, newStatus);
      setEditingPayment(null);
    } catch (error) {
      console.error('Failed to update payment status:', error);
      // You might want to show an error toast here
    } finally {
      setUpdatingPayment(null);
    }
  };

  const cancelEdit = () => {
    setEditingPayment(null);
  };

  // Common payment status options
  const paymentStatusOptions = ['pending', 'paid', 'failed', 'refunded', 'cancelled'];

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
        <h2 className="text-lg font-bold text-white">Recent Bookings</h2>
      </div>

      {/* Search Box */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">Show:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
        
        {(searchTerm || filteredBookings.length !== bookings.length) && (
          <p className="text-sm text-gray-600 mt-2">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredBookings.length)} of {filteredBookings.length} bookings
            {searchTerm && ` (filtered from ${bookings.length} total)`}
          </p>
        )}
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <RefreshCw size={32} className="animate-spin text-purple-500" />
          <span className="ml-2 font-semibold text-gray-600">Loading...</span>
        </div>
      ) : currentBookings.length === 0 ? (
        <div className="text-center py-10">
          <Calendar size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="font-semibold text-gray-500">
            {searchTerm ? 'No bookings match your search' : 'No bookings found'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Service</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Date & Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Payment</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-800">Price</th>
                {isAdmin && <th className="px-4 py-3 text-left font-semibold text-gray-800">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking, index) => {
                const { date, time } = formatDateTime(booking.appointment_time);
                const service = services.find(s => s.id === parseInt(booking.service_id));
                
                return (
                  <tr key={booking.id} className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${(startIndex + index) % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded font-semibold text-sm">
                        #{booking.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-800">{booking.customer_name}</p>
                        <div className="flex items-center gap-1 text-gray-600 text-xs">
                          <Phone size={12} />
                          <span>{booking.phone_number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">
                        {service ? service.name : `Service ID: ${booking.service_id}`}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-800">{date}</p>
                        <p className="text-gray-600 text-sm">{time}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded border font-semibold text-xs uppercase ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {editingPayment === booking.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            defaultValue={booking.payment_status}
                            className="px-2 py-1 text-xs border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            onChange={(e) => handlePaymentStatusChange(booking.id, e.target.value)}
                            disabled={updatingPayment === booking.id}
                          >
                            {paymentStatusOptions.map(status => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={cancelEdit}
                            disabled={updatingPayment === booking.id}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded font-semibold text-xs uppercase ${getPaymentBadge(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => setEditingPayment(booking.id)}
                              className="text-purple-600 hover:text-purple-800 text-xs underline"
                              disabled={updatingPayment === booking.id}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      )}
                      {updatingPayment === booking.id && (
                        <div className="flex items-center gap-1 mt-1">
                          <RefreshCw size={12} className="animate-spin text-purple-500" />
                          <span className="text-xs text-gray-500">Updating...</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-green-600">
                        ${service ? service.price : 'N/A'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {editingPayment !== booking.id && (
                            <button
                              onClick={() => setEditingPayment(booking.id)}
                              disabled={updatingPayment === booking.id}
                              className="text-sm bg-purple-100 text-purple-700 hover:bg-purple-200 px-2 py-1 rounded transition-colors disabled:opacity-50"
                            >
                              Update Payment
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!loading && filteredBookings.length > 0 && totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex space-x-1">
                {/* Show page numbers */}
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  const showPage = page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2;
                  
                  if (!showPage && page !== currentPage - 3 && page !== currentPage + 3) {
                    return null;
                  }
                  
                  if (page === currentPage - 3 || page === currentPage + 3) {
                    return <span key={page} className="px-2 text-gray-500">...</span>;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                        page === currentPage
                          ? 'bg-purple-500 text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableView;