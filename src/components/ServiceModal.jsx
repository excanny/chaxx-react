import React from 'react';
import { XCircle, Save } from 'lucide-react';

const ServiceModal = ({ 
  show, 
  editingService, 
  serviceForm, 
  onFormChange, 
  onSave, 
  onClose 
}) => {
  if (!show) return null;

  const handleSave = () => {
    if (!serviceForm.name || !serviceForm.price) {
      alert('Please fill in required fields');
      return;
    }
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-pink-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {editingService ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
          >
            <XCircle size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-gray-800 mb-2">Service Name *</label>
            <input
              type="text"
              value={serviceForm.name}
              onChange={(e) => onFormChange('name', e.target.value)}
              placeholder="e.g. Hair Cut & Style"
              className="w-full border-2 border-pink-200 rounded-lg px-4 py-2 font-semibold focus:border-pink-500 focus:outline-none transition-all bg-white shadow"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-800 mb-2">Description</label>
            <textarea
              value={serviceForm.description}
              onChange={(e) => onFormChange('description', e.target.value)}
              placeholder="Brief description of the service"
              rows={3}
              className="w-full border-2 border-pink-200 rounded-lg px-4 py-2 font-semibold focus:border-pink-500 focus:outline-none transition-all bg-white shadow resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-800 mb-2">Price ($) *</label>
              <input
                type="number"
                value={serviceForm.price}
                onChange={(e) => onFormChange('price', e.target.value)}
                placeholder="45"
                min="0"
                step="0.01"
                className="w-full border-2 border-pink-200 rounded-lg px-4 py-2 font-semibold focus:border-pink-500 focus:outline-none transition-all bg-white shadow"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-800 mb-2">Duration</label>
              <input
                type="text"
                value={serviceForm.duration}
                onChange={(e) => onFormChange('duration', e.target.value)}
                placeholder="1 hour"
                className="w-full border-2 border-pink-200 rounded-lg px-4 py-2 font-semibold focus:border-pink-500 focus:outline-none transition-all bg-white shadow"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
            >
              <Save size={16} />
              {editingService ? 'Update' : 'Create'}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;