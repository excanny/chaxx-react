import React from 'react';
import { XCircle, Phone } from 'lucide-react';
import { getStatusBadge, getPaymentBadge } from '../utils/helpers';

const AppointmentModal = ({ appointment, services, onClose }) => {
  if (!appointment) return null;

  const service = services.find(s => s.id === parseInt(appointment.service_id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-5 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
          <button
            onClick={onClose}
            className="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
          >
            <XCircle size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Customer Info */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Customer</h3>
            <p className="text-lg font-bold text-gray-800">{appointment.customer_name}</p>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Phone size={14} />
              <span className="text-sm">{appointment.phone_number}</span>
            </div>
          </div>

          {/* Service Info */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Service</h3>
            <p className="font-bold text-gray-800">
              {service?.name || `Service ${appointment.service_id}`}
            </p>
            {service?.description && (
              <p className="text-gray-600 text-sm mt-1">
                {service.description}
              </p>
            )}
          </div>

          {/* Appointment Time */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Date & Time</h3>
            <p className="font-bold text-gray-800">
              {new Date(appointment.appointment_time).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-purple-600 font-bold">
              {new Date(appointment.appointment_time).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </p>
          </div>

          {/* Status and Payment */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Status</h3>
              <span className={`px-2.5 py-1 rounded-full border font-semibold text-xs uppercase ${getStatusBadge(appointment.status)}`}>
                {appointment.status}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-1">Payment</h3>
              <span className={`px-2.5 py-1 rounded-full font-semibold text-xs uppercase ${getPaymentBadge(appointment.payment_status)}`}>
                {appointment.payment_status}
              </span>
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-1">Price</h3>
            <p className="text-xl font-bold text-green-600">
              ${service?.price || 'N/A'}
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;