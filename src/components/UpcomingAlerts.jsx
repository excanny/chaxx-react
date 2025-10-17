import React from 'react';
import { Bell, Clock } from 'lucide-react';

const UpcomingAlerts = ({ upcomingAlerts, services }) => {
  if (upcomingAlerts.length === 0) return null;

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={20} className="text-amber-600 animate-pulse" />
        <h3 className="text-lg font-bold text-amber-800">
          Upcoming Appointments (24h)
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {upcomingAlerts.map((booking) => {
          const appointmentTime = new Date(booking.appointment_time);
          const service = services.find(s => s.id === parseInt(booking.service_id));
          const hoursUntil = Math.round((appointmentTime - new Date()) / (1000 * 60 * 60));
          
          return (
            <div key={booking.id} className="bg-white rounded-lg p-3 shadow border border-amber-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800">{booking.customer_name}</h4>
                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">
                  {hoursUntil}h
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-1">
                Phone Number: {booking.phone_number}
              </p>
               <p className="text-gray-600 text-sm mb-1">
                Email: {booking.email}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={12} />
                <span>{appointmentTime.toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpcomingAlerts;