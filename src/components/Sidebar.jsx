import React from 'react';
import { Calendar, Users, Settings, RefreshCw, Bell, LogOut, XCircle } from 'lucide-react';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  bookingView, 
  setBookingView, 
  stats, 
  upcomingAlerts, 
  fetchBookings, 
  loading,
  onSignOut 
}) => (
  <div className="w-64 bg-white shadow-xl border-r-4 border-purple-200 p-4 flex flex-col">
    {/* Logo/Brand */}
    <div className="mb-6">
      <h1 className="text-xl font-bold text-gray-800 mb-1">Chaxx Barbershop</h1>
      <p className="text-sm text-gray-600">Management Dashboard</p>
    </div>

    {/* Navigation */}
    <nav className="mb-6">
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-purple-100 text-purple-700 border-l-4 border-purple-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar size={18} />
            Bookings
          </button>
        </li>
        {/* <li>
          <button
            onClick={() => setActiveTab('services')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'services'
                ? 'bg-pink-100 text-pink-700 border-l-4 border-pink-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings size={18} />
            Services
          </button>
        </li> */}
        <li>
          <button
            onClick={() => setActiveTab('blocked-slots')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'blocked-slots'
                ? 'bg-red-100 text-red-700 border-l-4 border-red-500'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
           <XCircle size={18} />
            Blocked Slots
          </button>
        </li>
      </ul>
    </nav>

    {/* Quick Stats */}
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Quick Stats</h3>
      <div className="space-y-2">
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Bookings</span>
            <span className="font-bold text-purple-600">{stats.totalBookings}</span>
          </div>
        </div>
        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Pending</span>
            <span className="font-bold text-yellow-600">{stats.pendingBookings}</span>
          </div>
        </div>
        {/* <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Revenue</span>
            <span className="font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</span>
          </div>
        </div> */}
      </div>
    </div>

    {/* Quick Actions */}
    <div className="mb-6">
      <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Quick Actions</h3>
      <div className="space-y-2">
        <button
          onClick={fetchBookings}
          disabled={loading}
          className="w-full flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>
    </div>

    {/* Booking View Toggle */}
    {activeTab === 'bookings' && (
      <div className="mb-2">
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">View Mode</h3>
        <div className="space-y-2">
          <button
            onClick={() => setBookingView('calendar')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
              bookingView === 'calendar'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar size={16} />
            Calendar View
          </button>
          <button
            onClick={() => setBookingView('table')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg font-semibold transition-all ${
              bookingView === 'table'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users size={16} />
            Table View
          </button>
        </div>
      </div>
    )}

    {/* Alerts Badge */}
    {upcomingAlerts.length > 0 && (
      <div className="mt-2">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-amber-600" />
            <span className="text-sm font-semibold text-amber-800">Upcoming</span>
            <span className="bg-amber-200 text-amber-800 text-xs font-bold px-2 py-1 rounded-full">
              {upcomingAlerts.length}
            </span>
          </div>
          <p className="text-xs text-amber-700">
            {upcomingAlerts.length} appointment{upcomingAlerts.length !== 1 ? 's' : ''} in next 24h
          </p>
        </div>
      </div>
    )}

    {/* Sign Out Button */}
    <div className="mt-2 pt-4 border-t border-gray-200">
      <button
        onClick={onSignOut}
        className="w-full flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-semibold"
      >
        <LogOut size={16} />
        Sign Out
      </button>
    </div>
  </div>
);

export default Sidebar;