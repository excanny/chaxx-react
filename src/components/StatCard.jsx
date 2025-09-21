import React from 'react';

const StatCard = ({ icon: Icon, label, value, color, bgColor, onClick }) => (
  <div 
    className={`${bgColor} rounded-lg p-4 shadow-lg border-2 border-opacity-20 ${color.replace('text-', 'border-')} transform hover:scale-105 transition-all duration-300 ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 font-semibold text-sm">{label}</p>
        <p className={`text-2xl font-bold ${color} mt-1`}>{value}</p>
      </div>
      <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-')} bg-opacity-20`}>
        <Icon size={20} className={color} />
      </div>
    </div>
  </div>
);

export default StatCard;