import { useState, useEffect } from 'react';

const BookingForm = ({ selectedDate, setSelectedDate, preferredTime, setPreferredTime, handleSubmit }) => {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [paymentOption, setPaymentOption] = useState("later");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Get base URL from environment variables with fallback
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
 
  const services = [
    { id: 1, name: "Hair Cut & Style", duration: "1 hour", price: "$45", description: "Professional haircut with styling" },
    { id: 2, name: "Hair Color Treatment", duration: "2-3 hours", price: "$85", description: "Full color treatment with consultation" },
    { id: 3, name: "Facial Treatment", duration: "90 minutes", price: "$75", description: "Deep cleansing and rejuvenating facial" },
    { id: 4, name: "Manicure & Pedicure", duration: "2 hours", price: "$65", description: "Complete nail care treatment" },
    { id: 5, name: "Massage Therapy", duration: "60 minutes", price: "$95", description: "Relaxing full-body massage" },
    { id: 6, name: "Bridal Package", duration: "4 hours", price: "$250", description: "Complete bridal beauty treatment" }
  ];

  const dailySlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.getHours() * 100 + now.getMinutes();

  const isTimeInPast = (timeSlot) => {
    if (selectedDate !== today) return false;
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = hours * 100 + minutes;
    return slotTime <= currentTime;
  };

  // Fetch available time slots when date changes
  const fetchAvailableSlots = async (date) => {
    if (!date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    try {
      const response = await fetch(`${baseUrl}/available-slots?date=${date}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Process the slots to include availability and past time info
        const processedSlots = dailySlots.map((time) => {
          const isBooked = !data.available_slots.includes(time);
          const isPast = isTimeInPast(time);
          return { time, isBooked, isPast };
        });

        setAvailableSlots(processedSlots);
      } else {
        console.error('Failed to fetch available slots');
        // Fallback to default behavior if API fails
        const fallbackSlots = dailySlots.map((time) => {
          const isPast = isTimeInPast(time);
          return { time, isBooked: false, isPast };
        });
        setAvailableSlots(fallbackSlots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Fallback to default behavior if API fails
      const fallbackSlots = dailySlots.map((time) => {
        const isPast = isTimeInPast(time);
        return { time, isBooked: false, isPast };
      });
      setAvailableSlots(fallbackSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Effect to fetch slots when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  const handleApiSubmit = async () => {
    if (!selectedService) {
      setSubmitMessage("Please select a service");
      return;
    }
    if (!customerName.trim()) {
      setSubmitMessage("Please enter your name");
      return;
    }
    if (!phoneNumber.trim()) {
      setSubmitMessage("Please enter your phone number");
      return;
    }
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setSubmitMessage("Please enter a valid 10-digit phone number");
      return;
    }
    if (!selectedDate) {
      setSubmitMessage("Please select a date");
      return;
    }
    if (!preferredTime) {
      setSubmitMessage("Please select a time slot");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const appointmentDateTime = `${selectedDate} ${preferredTime}:00`;
      
      const bookingData = {
        service_id: parseInt(selectedService),
        customer_name: customerName.trim(),
        phone_number: phoneDigits,
        appointment_time: appointmentDateTime,
        pay_now: paymentOption === "now"
      };

      const response = await fetch(`${baseUrl}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage("🎉 Booking confirmed! We'll contact you soon.");
        
        setSelectedService("");
        setCustomerName("");
        setPhoneNumber("");
        setPaymentOption("later");
        setSelectedDate("");
        setPreferredTime("");
        setAvailableSlots([]);
        
        if (handleSubmit) {
          handleSubmit(result);
        }
      } else {
        const errorData = await response.json();
        setSubmitMessage(`❌ Booking failed: ${errorData.message || 'Please try again'}`);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitMessage("❌ Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-4 left-4 w-8 h-8 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Date Selection */}
      <div className="mb-6 relative z-10">
        <label className="block text-lg font-bold text-purple-600 mb-3">
          🗓️ Pick Your Date
        </label>
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setPreferredTime("");
          }}
          className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg font-semibold focus:border-purple-500 focus:outline-none transition-all bg-white shadow-md hover:shadow-lg"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mb-8 relative z-10">
          <label className="block text-lg font-bold text-cyan-600 mb-4">
            ⏰ Choose Your Time
          </label>
          
          {loadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-cyan-600 font-semibold">Loading available times...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {availableSlots.map(({ time, isBooked, isPast }) => (
                <button
                  key={time}
                  disabled={isBooked || isPast}
                  onClick={() => setPreferredTime(time)}
                  className={`px-3 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                    isBooked || isPast
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : preferredTime === time
                      ? "bg-purple-500 text-white shadow-lg scale-105"
                      : "bg-white border-2 border-purple-200 text-purple-600 hover:border-purple-500 hover:bg-purple-50 shadow-md hover:shadow-lg"
                  }`}
                  title={isPast ? "Time has passed" : isBooked ? "Already booked" : "Available"}
                >
                  {time}
                  {isPast && <span className="block text-xs">Past</span>}
                  {isBooked && !isPast && <span className="block text-xs">Booked</span>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact Form */}
      <div className="space-y-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">✨ Your Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full border-2 border-cyan-200 rounded-xl px-4 py-3 text-md font-semibold focus:border-cyan-500 focus:outline-none transition-all bg-white shadow-md hover:shadow-lg"
            />
          </div>
          <div>
            <label className="block text-md font-bold text-gray-800 mb-2">📱 Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                let formatted = '';
                
                if (value.length >= 1) {
                  if (value.length <= 3) {
                    formatted = `(${value}`;
                  } else if (value.length <= 6) {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                  } else if (value.length <= 10) {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                  } else {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                  }
                }
                
                setPhoneNumber(formatted);
              }}
              placeholder="(416) 123-4567"
              maxLength={14}
              className="w-full border-2 border-cyan-200 rounded-xl px-4 py-3 text-md font-semibold focus:border-cyan-500 focus:outline-none transition-all bg-white shadow-md hover:shadow-lg"
            />
          </div>
        </div>

        {/* Payment Options */}
        <div>
          <label className="block text-md font-bold text-gray-800 mb-4">💳 Payment Option</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentOption("later")}
              className={`p-4 rounded-2xl border-2 transition-all transform hover:scale-102 text-left ${
                paymentOption === "later"
                  ? "border-emerald-500 bg-emerald-50 shadow-lg scale-102"
                  : "border-gray-300 bg-white hover:border-emerald-300 shadow-md"
              }`}
            >
              <div className="flex items-center mb-2">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  paymentOption === "later" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                }`}>
                  {paymentOption === "later" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <h3 className="text-md font-bold text-gray-800">Pay at Appointment</h3>
              </div>
              <p className="text-gray-600 text-sm">
                💼 Pay when you arrive. Cash, card, or e-transfer.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setPaymentOption("now")}
              className={`p-4 rounded-2xl border-2 transition-all text-left relative ${
                paymentOption === "now"
                  ? "border-gray-400 bg-gray-100 shadow-md"
                  : "border-gray-300 bg-gray-100 shadow-md cursor-not-allowed opacity-60"
              }`}
              disabled
            >
              <div className="flex items-center mb-2">
                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                  paymentOption === "now" ? "border-gray-400 bg-gray-400" : "border-gray-300"
                }`}>
                  {paymentOption === "now" && (
                    <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <h3 className="text-md font-bold text-gray-500">Pay Now Online</h3>
              </div>
              <p className="text-gray-400 text-sm">
                🚀 Secure your spot instantly with online payment.
              </p>
              <div className="mt-2 text-gray-400 font-bold text-sm">
                🎯 Guaranteed Booking
              </div>
              <div className="absolute top-2 right-2 bg-gray-400 text-white text-xs px-2 py-1 rounded-full font-bold">
                Coming Soon
              </div>
            </button>
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`text-center p-3 rounded-xl font-semibold text-md ${
            submitMessage.includes('confirmed') || submitMessage.includes('🎉') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {submitMessage}
          </div>
        )}

        <div className="pt-6 text-center">
          <button 
            onClick={handleApiSubmit}
            disabled={isSubmitting}
            className={`group relative ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : paymentOption === "now"
                ? 'bg-purple-500 hover:bg-purple-600 cursor-pointer hover:scale-105'
                : 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer hover:scale-105'
            } text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 transform shadow-lg hover:shadow-xl`}
          >
            <span className="relative z-10">
              {isSubmitting 
                ? 'Processing...' 
                : paymentOption === "now" 
                ? 'Pay & Book Now 💳' 
                : 'Book My Transformation 🚀'
              }
            </span>
            {!isSubmitting && (
              <>
                <div className={`absolute inset-0 ${
                  paymentOption === "now" ? 'bg-purple-400' : 'bg-emerald-400'
                } rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-all duration-300`}></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;