import React, { useState, useEffect } from 'react';
import { Calendar, Users, Plus, AlertCircle } from 'lucide-react';

// Import components
import Sidebar  from './Sidebar';
import UpcomingAlerts from './UpcomingAlerts';
import CalendarView from './CalendarView';
import TableView from './TableView';
import ServicesGrid from './ServicesGrid';
import AppointmentModal from './AppointmentModal';
import ServiceModal from './ServiceModal';

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookingView, setBookingView] = useState('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [upcomingAlerts, setUpcomingAlerts] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    todayBookings: 0
  });

  // Service form state
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    duration: ''
  });

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
 

  // Initialize services and sample data
  const initializeServices = () => {
    const defaultServices = [
      { id: 1, name: "Hair Cut & Style", description: "Professional haircut with styling", price: 45, duration: "1 hour" },
      { id: 2, name: "Hair Color Treatment", description: "Full color treatment with consultation", price: 85, duration: "2-3 hours" },
      { id: 3, name: "Facial Treatment", description: "Deep cleansing and rejuvenating facial", price: 75, duration: "90 minutes" },
      { id: 4, name: "Manicure & Pedicure", description: "Complete nail care treatment", price: 65, duration: "2 hours" },
      { id: 5, name: "Massage Therapy", description: "Relaxing full-body massage", price: 95, duration: "60 minutes" },
      { id: 6, name: "Bridal Package", description: "Complete bridal beauty treatment", price: 250, duration: "4 hours" }
    ];
    setServices(defaultServices);
    
    // Add sample bookings
    const sampleBookings = [
      {
        id: 1,
        customer_name: "Sarah Johnson",
        phone_number: "+1-555-0123",
        service_id: 1,
        appointment_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 9, 0).toISOString(),
        status: "confirmed",
        payment_status: "paid"
      },
      {
        id: 2,
        customer_name: "Mike Davis",
        phone_number: "+1-555-0456",
        service_id: 2,
        appointment_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 10, 30).toISOString(),
        status: "pending",
        payment_status: "unpaid"
      },
      {
        id: 3,
        customer_name: "Emma Wilson",
        phone_number: "+1-555-0789",
        service_id: 3,
        appointment_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 11, 0).toISOString(),
        status: "confirmed",
        payment_status: "paid"
      },
      {
        id: 4,
        customer_name: "John Smith",
        phone_number: "+1-555-1011",
        service_id: 4,
        appointment_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 13, 0).toISOString(),
        status: "completed",
        payment_status: "paid"
      },
      {
        id: 5,
        customer_name: "Lisa Brown",
        phone_number: "+1-555-1213",
        service_id: 5,
        appointment_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 14, 30).toISOString(),
        status: "confirmed",
        payment_status: "pending"
      },
      {
        id: 6,
        customer_name: "David Lee",
        phone_number: "+1-555-1415",
        service_id: 6,
        appointment_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 16, 0).toISOString(),
        status: "pending",
        payment_status: "unpaid"
      },
      {
        id: 7,
        customer_name: "Amy Chen",
        phone_number: "+1-555-1617",
        service_id: 1,
        appointment_time: new Date(new Date().getFullYear(), new Date().getMonth(), 22, 17, 30).toISOString(),
        status: "confirmed",
        payment_status: "paid"
      },
      {
        id: 8,
        customer_name: "Robert Taylor",
        phone_number: "+1-555-1819",
        service_id: 2,
        appointment_time: new Date(new Date().getFullYear(), new Date().getMonth(), 25, 10, 0).toISOString(),
        status: "confirmed",
        payment_status: "paid"
      }
    ];
    setBookings(sampleBookings);
    setLoading(false);
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${baseUrl}/api/bookings`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBookings(data.bookings);
        } else {
          setError("Failed to fetch bookings data");
        }
      } else {
        setError(`API Error: ${response.status}`);
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate dashboard statistics
  const calculateStats = (bookingData) => {
    const today = new Date().toISOString().split('T')[0];
    
    const totalBookings = bookingData.length;
    const pendingBookings = bookingData.filter(b => b.status === 'pending').length;
    const todayBookings = bookingData.filter(b => 
      b.appointment_time.startsWith(today)
    ).length;
    
    const totalRevenue = bookingData.reduce((sum, booking) => {
      const service = services.find(s => s.id === parseInt(booking.service_id));
      return sum + (service ? service.price : 0);
    }, 0);

    setStats({
      totalBookings,
      pendingBookings,
      totalRevenue,
      todayBookings
    });

    // Calculate upcoming alerts
    calculateUpcomingAlerts(bookingData);
  };

  // Calculate upcoming appointment alerts
  const calculateUpcomingAlerts = (bookingData) => {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    const upcoming = bookingData.filter(booking => {
      const appointmentDate = new Date(booking.appointment_time);
      return appointmentDate > now && appointmentDate <= next24Hours && booking.status !== 'cancelled';
    });

    setUpcomingAlerts(upcoming);
  };

  // Service management functions
  const handleServiceFormChange = (field, value) => {
    setServiceForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const openServiceForm = (service = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration
      });
    } else {
      setEditingService(null);
      setServiceForm({
        name: '',
        description: '',
        price: '',
        duration: ''
      });
    }
    setShowServiceForm(true);
  };

  const closeServiceForm = () => {
    setShowServiceForm(false);
    setEditingService(null);
    setServiceForm({
      name: '',
      description: '',
      price: '',
      duration: ''
    });
  };

  const saveService = () => {
    const serviceData = {
      name: serviceForm.name,
      description: serviceForm.description,
      price: parseFloat(serviceForm.price),
      duration: serviceForm.duration
    };

    if (editingService) {
      setServices(prev => prev.map(service => 
        service.id === editingService.id 
        ? { ...service, ...serviceData }
        : service
      ));
    } else {
      const newService = {
        id: Math.max(...services.map(s => s.id), 0) + 1,
        ...serviceData
      };
      setServices(prev => [...prev, newService]);
    }
    
    closeServiceForm();
  };

  const deleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
    }
  };

  useEffect(() => {
    initializeServices();
    fetchBookings();
  }, []);

  useEffect(() => {
    if (bookings.length > 0 && services.length > 0) {
      calculateStats(bookings);
    }
  }, [bookings, services]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookingView={bookingView}
        setBookingView={setBookingView}
        stats={stats}
        upcomingAlerts={upcomingAlerts}
        fetchBookings={fetchBookings}
        loading={loading}
      />

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {activeTab}
            </h2>
            
            {/* Bookings View Toggle */}
            {activeTab === 'bookings' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setBookingView('calendar')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    bookingView === 'calendar'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white text-blue-600 hover:bg-blue-50 shadow border border-blue-200'
                  }`}
                >
                  <Calendar size={16} />
                  Calendar View
                </button>
                <button
                  onClick={() => setBookingView('table')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    bookingView === 'table'
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'bg-white text-blue-600 hover:bg-blue-50 shadow border border-blue-200'
                  }`}
                >
                  <Users size={16} />
                  Table View
                </button>
              </div>
            )}

            {/* Services Add Button */}
            {activeTab === 'services' && (
              <button
                onClick={() => openServiceForm()}
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
              >
                <Plus size={16} />
                Add New Service
              </button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-2 border-red-300 text-red-800 px-4 py-3 rounded-lg mb-4 flex items-center gap-2">
              <AlertCircle size={20} />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <UpcomingAlerts upcomingAlerts={upcomingAlerts} services={services} />

          {/* Content based on active tab and view */}
          {activeTab === 'bookings' && bookingView === 'calendar' && (
            <CalendarView
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              bookings={bookings}
              services={services}
              loading={loading}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              setSelectedAppointment={setSelectedAppointment}
            />
          )}

          {activeTab === 'bookings' && bookingView === 'table' && (
            <TableView
              bookings={bookings}
              services={services}
              loading={loading}
            />
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <ServicesGrid
                services={services}
                openServiceForm={openServiceForm}
                deleteService={deleteService}
              />
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-6 text-gray-600 text-sm">
            <p>Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AppointmentModal
        appointment={selectedAppointment}
        services={services}
        onClose={() => setSelectedAppointment(null)}
      />

      <ServiceModal
        show={showServiceForm}
        editingService={editingService}
        serviceForm={serviceForm}
        onFormChange={handleServiceFormChange}
        onSave={saveService}
        onClose={closeServiceForm}
      />
    </div>
  );
}

export default AdminDashboard;