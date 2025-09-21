
// components/CalendarView.js
import React from 'react';
import { RefreshCw, ChevronLeft, ChevronRight, Phone, DollarSign } from 'lucide-react';
import { getStatusBadge, getPaymentBadge } from '../utils/helpers';

const CalendarView = ({ 
  currentDate, 
  setCurrentDate, 
  bookings, 
  services, 
  loading, 
  selectedDate, 
  setSelectedDate, 
  setSelectedAppointment 
}) => {
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return bookings.filter(booking => 
      booking.appointment_time.startsWith(dateStr)
    );
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">Calendar</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-all"
            >
              <ChevronLeft size={20} className="text-white" />
            </button>
            <h3 className="font-semibold text-white min-w-[150px] text-center">
              {getMonthName(currentDate)}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-all"
            >
              <ChevronRight size={20} className="text-white" />
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <RefreshCw size={32} className="animate-spin text-purple-500" />
          <span className="ml-2 font-semibold text-gray-600">Loading...</span>
        </div>
      ) : (
        <div className="p-4">
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells */}
            {Array.from({ length: getFirstDayOfMonth(currentDate) }, (_, i) => (
              <div key={`empty-${i}`} className="h-20"></div>
            ))}
            
            {/* Calendar days */}
            {Array.from({ length: getDaysInMonth(currentDate) }, (_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dayBookings = getBookingsForDate(date);
              const todayClass = isToday(date) ? 'ring-2 ring-blue-400 bg-blue-50' : '';
              const selectedClass = isSelected(date) ? 'ring-2 ring-purple-400' : '';
              
              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`h-32 border border-gray-200 rounded-lg p-1 hover:border-purple-400 transition-all hover:shadow cursor-pointer ${todayClass} ${selectedClass} flex flex-col bg-white`}
                >
                  <div className="flex justify-between items-center mb-1 flex-shrink-0">
                    <span className="font-semibold text-gray-800 text-sm">{day}</span>
                    {dayBookings.length > 0 && (
                      <span className="bg-purple-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {dayBookings.map((booking) => {
                      const time = new Date(booking.appointment_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      });
                      const service = services.find(s => s.id === parseInt(booking.service_id));
                      
                      return (
                        <div
                          key={booking.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAppointment(booking);
                          }}
                          className={`text-xs p-1.5 rounded-md cursor-pointer transition-all hover:scale-105 hover:shadow-md font-medium border-l-2 flex-shrink-0 ${
                            booking.status === 'pending' ? 'bg-yellow-50 text-yellow-900 border-yellow-400 hover:bg-yellow-100' :
                            booking.status === 'confirmed' ? 'bg-green-50 text-green-900 border-green-400 hover:bg-green-100' :
                            booking.status === 'completed' ? 'bg-blue-50 text-blue-900 border-blue-400 hover:bg-blue-100' :
                            'bg-red-50 text-red-900 border-red-400 hover:bg-red-100'
                          }`}
                        >
                          <div className="font-semibold leading-tight">{time}</div>
                          <div className="truncate text-xs opacity-90 leading-tight">
                            {booking.customer_name}
                          </div>
                          <div className="truncate text-xs opacity-75 leading-tight">
                            {service ? service.name : `Service ${booking.service_id}`}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Selected Date Details */}
          {selectedDate && (
            <div className="mt-4 bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-800 mb-3">
                {selectedDate.toLocaleDateString()}
              </h3>
              
              {getBookingsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-600">No appointments scheduled.</p>
              ) : (
                <div className="space-y-2">
                  {getBookingsForDate(selectedDate).map((booking) => {
                    const time = new Date(booking.appointment_time).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    });
                    const service = services.find(s => s.id === parseInt(booking.service_id));
                    
                    return (
                      <div key={booking.id} className="bg-white rounded-lg p-3 shadow border border-purple-200">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-800">{booking.customer_name}</h4>
                            <p className="text-purple-600 font-semibold text-sm">{service ? service.name : `Service ${booking.service_id}`}</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-purple-600">{time}</div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusBadge(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-gray-600 text-sm">
                          <div className="flex items-center gap-1">
                            <Phone size={12} />
                            <span>{booking.phone_number}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign size={12} />
                            <span className="font-semibold">${service ? service.price : 'N/A'}</span>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getPaymentBadge(booking.payment_status)}`}>
                            {booking.payment_status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;