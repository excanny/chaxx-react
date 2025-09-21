import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const ServicesGrid = ({ services, openServiceForm, deleteService }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {services.map((service) => (
      <div key={service.id} className="bg-white rounded-lg shadow-lg border-2 border-pink-200 p-4 hover:shadow-xl transition-all transform hover:scale-105">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">{service.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{service.description}</p>
          </div>
          <div className="flex gap-1 ml-2">
            <button
              onClick={() => openServiceForm(service)}
              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all"
            >
              <Edit size={14} />
            </button>
            <button
              onClick={() => deleteService(service.id)}
              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-pink-600">
            ${service.price}
          </div>
          <div className="text-gray-500 font-semibold text-sm">
            {service.duration}
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ServicesGrid;