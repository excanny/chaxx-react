import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Clock, Phone, Mail, Check, X, AlertCircle, RefreshCw, Plus, Edit, Trash2, Save, XCircle, Settings, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

function AdminDashboard() {
    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookingView, setBookingView] = useState('calendar'); // 'calendar' or 'table'
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

    // Initial services data
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
        
        // Add some sample bookings for testing
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
            const response = await fetch('http://localhost:8000/api/bookings');
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

    // Calendar helper functions
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
        if (!serviceForm.name || !serviceForm.price) {
            alert('Please fill in required fields');
            return;
        }

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

    // Format date and time
    const formatDateTime = (dateTime) => {
        const date = new Date(dateTime);
        return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const styles = {
            pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
            confirmed: "bg-green-100 text-green-800 border-green-300",
            completed: "bg-blue-100 text-blue-800 border-blue-300",
            cancelled: "bg-red-100 text-red-800 border-red-300"
        };
        return styles[status] || "bg-gray-100 text-gray-800 border-gray-300";
    };

    // Get payment status badge styling
    const getPaymentBadge = (paymentStatus) => {
        const styles = {
            paid: "bg-green-100 text-green-800",
            unpaid: "bg-red-100 text-red-800",
            pending: "bg-yellow-100 text-yellow-800"
        };
        return styles[paymentStatus] || "bg-gray-100 text-gray-800";
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50 flex">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-xl border-r-4 border-purple-200 p-4 flex flex-col">
                {/* Logo/Brand */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-800 mb-1">Beauty Admin</h1>
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
                        <li>
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
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Revenue</span>
                                <span className="font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</span>
                            </div>
                        </div>
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

                {/* Booking View Toggle (when on bookings tab) */}
                {activeTab === 'bookings' && (
                    <div className="mb-6">
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
                    <div className="mt-auto">
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
            </div>

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

                    {/* Upcoming Alerts */}
                    {upcomingAlerts.length > 0 && (
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
                                                {service ? service.name : `Service ${booking.service_id}`}
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
                    )}

                    {/* Calendar View */}
                    {activeTab === 'bookings' && bookingView === 'calendar' && (
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
                                                    className={`h-32 border border-gray-200 rounded-lg p-1 hover:border-purple-400 transition-all hover:shadow ${todayClass} ${selectedClass} flex flex-col bg-white`}
                                                >
                                                    <div className="flex justify-between items-center mb-1 flex-shrink-0">
                                                        <span className="font-semibold text-gray-800 text-sm">{day}</span>
                                                        {dayBookings.length > 0 && (
                                                            <span className="bg-purple-500 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full">
                                                                {dayBookings.length}
                                                            </span>
                                                        )}
                                                    </div>
                                                    
                                                    <div className="flex-1 overflow-y-auto space-y-0.5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
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
                                                                        console.log('Appointment clicked:', booking); // Debug log
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
                    )}

                    {/* Table View */}
                    {activeTab === 'bookings' && bookingView === 'table' && (
                        <div className="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3">
                                <h2 className="text-lg font-bold text-white">Recent Bookings</h2>
                            </div>
                            
                            {loading ? (
                                <div className="flex justify-center items-center py-10">
                                    <RefreshCw size={32} className="animate-spin text-purple-500" />
                                    <span className="ml-2 font-semibold text-gray-600">Loading...</span>
                                </div>
                            ) : bookings.length === 0 ? (
                                <div className="text-center py-10">
                                    <Calendar size={48} className="mx-auto text-gray-300 mb-2" />
                                    <p className="font-semibold text-gray-500">No bookings found</p>
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
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map((booking, index) => {
                                                const { date, time } = formatDateTime(booking.appointment_time);
                                                const service = services.find(s => s.id === parseInt(booking.service_id));
                                                
                                                return (
                                                    <tr key={booking.id} className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
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
                                                            <span className={`px-2 py-1 rounded font-semibold text-xs uppercase ${getPaymentBadge(booking.payment_status)}`}>
                                                                {booking.payment_status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="text-lg font-bold text-green-600">
                                                                ${service ? service.price : 'N/A'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Services Management */}
                    {activeTab === 'services' && (
                        <div className="space-y-4">
                            {/* Services Grid */}
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
                        </div>
                    )}

                    {/* Appointment Details Modal */}
                    {selectedAppointment && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-6 max-w-md w-full">
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">Appointment Details</h2>
                                    <button
                                        onClick={() => setSelectedAppointment(null)}
                                        className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                                    >
                                        <XCircle size={20} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Customer Info */}
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Customer</h3>
                                        <p className="text-lg font-bold text-gray-800">{selectedAppointment.customer_name}</p>
                                        <div className="flex items-center gap-2 text-gray-600 mt-1">
                                            <Phone size={16} />
                                            <span>{selectedAppointment.phone_number}</span>
                                        </div>
                                    </div>

                                    {/* Service Info */}
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Service</h3>
                                        <p className="font-bold text-gray-800">
                                            {services.find(s => s.id === parseInt(selectedAppointment.service_id))?.name || `Service ${selectedAppointment.service_id}`}
                                        </p>
                                        {services.find(s => s.id === parseInt(selectedAppointment.service_id))?.description && (
                                            <p className="text-gray-600 text-sm mt-1">
                                                {services.find(s => s.id === parseInt(selectedAppointment.service_id)).description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Appointment Time */}
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Date & Time</h3>
                                        <p className="font-bold text-gray-800">
                                            {new Date(selectedAppointment.appointment_time).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-purple-600 font-bold">
                                            {new Date(selectedAppointment.appointment_time).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </p>
                                    </div>

                                    {/* Status and Payment */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">Status</h3>
                                            <span className={`px-3 py-1 rounded-full border font-semibold text-sm uppercase ${getStatusBadge(selectedAppointment.status)}`}>
                                                {selectedAppointment.status}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-700 mb-2">Payment</h3>
                                            <span className={`px-3 py-1 rounded-full font-semibold text-sm uppercase ${getPaymentBadge(selectedAppointment.payment_status)}`}>
                                                {selectedAppointment.payment_status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Price</h3>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${services.find(s => s.id === parseInt(selectedAppointment.service_id))?.price || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t">
                                    <button
                                        onClick={() => setSelectedAppointment(null)}
                                        className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {showServiceForm && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-2xl border border-pink-200 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-800">
                                        {editingService ? 'Edit Service' : 'Add New Service'}
                                    </h2>
                                    <button
                                        onClick={closeServiceForm}
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
                                            onChange={(e) => handleServiceFormChange('name', e.target.value)}
                                            placeholder="e.g. Hair Cut & Style"
                                            className="w-full border-2 border-pink-200 rounded-lg px-4 py-2 font-semibold focus:border-pink-500 focus:outline-none transition-all bg-white shadow"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-gray-800 mb-2">Description</label>
                                        <textarea
                                            value={serviceForm.description}
                                            onChange={(e) => handleServiceFormChange('description', e.target.value)}
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
                                                onChange={(e) => handleServiceFormChange('price', e.target.value)}
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
                                                onChange={(e) => handleServiceFormChange('duration', e.target.value)}
                                                placeholder="1 hour"
                                                className="w-full border-2 border-pink-200 rounded-lg px-4 py-2 font-semibold focus:border-pink-500 focus:outline-none transition-all bg-white shadow"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-4">
                                        <button
                                            onClick={saveService}
                                            className="flex-1 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
                                        >
                                            <Save size={16} />
                                            {editingService ? 'Update' : 'Create'}
                                        </button>
                                        <button
                                            onClick={closeServiceForm}
                                            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="text-center mt-6 text-gray-600 text-sm">
                        <p>Last updated: {new Date().toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;