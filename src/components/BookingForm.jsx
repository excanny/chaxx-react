import { useState } from 'react';

const BookingForm = ({ selectedDate, setSelectedDate, preferredTime, setPreferredTime, handleSubmit }) => {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [paymentOption, setPaymentOption] = useState("later"); // "now" or "later"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Sample services - replace with your actual services
  const services = [
    { id: 1, name: "Hair Cut & Style", duration: "1 hour", price: "$45", description: "Professional haircut with styling" },
    { id: 2, name: "Hair Color Treatment", duration: "2-3 hours", price: "$85", description: "Full color treatment with consultation" },
    { id: 3, name: "Facial Treatment", duration: "90 minutes", price: "$75", description: "Deep cleansing and rejuvenating facial" },
    { id: 4, name: "Manicure & Pedicure", duration: "2 hours", price: "$65", description: "Complete nail care treatment" },
    { id: 5, name: "Massage Therapy", duration: "60 minutes", price: "$95", description: "Relaxing full-body massage" },
    { id: 6, name: "Bridal Package", duration: "4 hours", price: "$250", description: "Complete bridal beauty treatment" }
  ];

  const dailySlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
  const bookedSlots = {
    "2025-09-17": ["11:00", "15:00"],
    "2025-09-18": ["10:00", "14:00"],
  };

  // Get current date and time
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.getHours() * 100 + now.getMinutes(); // Convert to HHMM format for easy comparison

  // Helper function to check if a time slot is in the past
  const isTimeInPast = (timeSlot) => {
    if (selectedDate !== today) return false;
    
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const slotTime = hours * 100 + minutes;
    return slotTime <= currentTime;
  };

  const availableSlots = dailySlots.map((time) => {
    const isBooked = bookedSlots[selectedDate]?.includes(time);
    const isPast = isTimeInPast(time);
    return { time, isBooked, isPast };
  });

  const handleApiSubmit = async () => {
    // Validation
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
    // Validate Canadian phone number format
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
      // Format the appointment time for the API
      const appointmentDateTime = `${selectedDate} ${preferredTime}:00`;
      
      const bookingData = {
        service_id: parseInt(selectedService),
        customer_name: customerName.trim(),
        phone_number: phoneDigits, // Send clean digits to API
        appointment_time: appointmentDateTime,
        pay_now: paymentOption === "now"
      };

      const response = await fetch('http://localhost:8000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const result = await response.json();
        setSubmitMessage("🎉 Booking confirmed! We'll contact you soon.");
        
        // Reset form
        setSelectedService("");
        setCustomerName("");
        setPhoneNumber("");
        setPaymentOption("later");
        setSelectedDate("");
        setPreferredTime("");
        
        // Call the original handleSubmit if provided
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
    <div className="bg-gray-50 rounded-3xl p-12 shadow-2xl border-4 border-gray-200 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-6 left-6 w-12 h-12 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-6 right-6 w-16 h-16 bg-cyan-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>

      {/* Service Selection */}
      <div className="mb-10 relative z-10">
        <label className="block text-2xl font-black text-pink-600 mb-6">
          ✨ Choose Your Service
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedService(service.id.toString())}
              className={`p-6 rounded-3xl border-4 transition-all transform hover:scale-105 text-left ${
                selectedService === service.id.toString()
                  ? "border-pink-500 bg-pink-50 shadow-xl scale-105 rotate-1"
                  : "border-pink-200 bg-white hover:border-pink-400 shadow-lg hover:shadow-xl"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black text-gray-800">{service.name}</h3>
                <div className={`w-5 h-5 rounded-full border-3 ${
                  selectedService === service.id.toString() 
                    ? "border-pink-500 bg-pink-500" 
                    : "border-gray-300"
                }`}>
                  {selectedService === service.id.toString() && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{service.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-pink-600 font-bold text-lg">{service.price}</span>
                <span className="text-gray-500 text-sm">{service.duration}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-10 relative z-10">
        <label className={`block text-2xl font-black text-purple-600 mb-4`}>
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
          className="w-full border-4 border-purple-200 rounded-2xl px-8 py-5 text-xl font-bold focus:border-purple-500 focus:outline-none transition-all bg-white shadow-lg hover:shadow-xl transform hover:scale-105"
        />
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="mb-12 relative z-10">
          <label className={`block text-2xl font-black text-cyan-600 mb-6`}>
            ⏰ Choose Your Time
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {availableSlots.map(({ time, isBooked, isPast }) => (
              <button
                key={time}
                disabled={isBooked || isPast}
                onClick={() => setPreferredTime(time)}
                className={`px-6 py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-110 ${
                  isBooked || isPast
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : preferredTime === time
                    ? "bg-purple-500 text-white shadow-xl scale-110 rotate-3"
                    : "bg-white border-4 border-purple-200 text-purple-600 hover:border-purple-500 hover:bg-purple-50 shadow-lg hover:shadow-xl hover:rotate-1"
                }`}
                title={isPast ? "Time has passed" : isBooked ? "Already booked" : "Available"}
              >
                {time}
                {isPast && <span className="block text-xs">Past</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Contact Form */}
      <div className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-xl font-black text-gray-800 mb-4">✨ Your Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="What should we call you?"
              className="w-full border-4 border-cyan-200 rounded-2xl px-8 py-5 text-xl font-bold focus:border-cyan-500 focus:outline-none transition-all bg-white shadow-lg hover:shadow-xl transform hover:scale-105"
            />
          </div>
          <div>
            <label className="block text-xl font-black text-gray-800 mb-4">📱 Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => {
                // Format phone number as user types
                const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                let formatted = '';
                
                if (value.length >= 1) {
                  if (value.length <= 3) {
                    formatted = `(${value}`;
                  } else if (value.length <= 6) {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                  } else if (value.length <= 10) {
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
                  } else {
                    // Limit to 10 digits
                    formatted = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                  }
                }
                
                setPhoneNumber(formatted);
              }}
              placeholder="(416) 123-4567"
              maxLength={14}
              className="w-full border-4 border-cyan-200 rounded-2xl px-8 py-5 text-xl font-bold focus:border-cyan-500 focus:outline-none transition-all bg-white shadow-lg hover:shadow-xl transform hover:scale-105"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xl font-black text-gray-800 mb-4">🕐 Your Selected Time</label>
          <input
            type="text"
            readOnly
            value={preferredTime}
            placeholder="Pick a time slot from above"
            className="w-full bg-gray-100 border-4 border-gray-300 rounded-2xl px-8 py-5 text-xl font-bold cursor-not-allowed shadow-lg"
          />
        </div>

        {/* Payment Options */}
        <div>
          <label className="block text-xl font-black text-gray-800 mb-6">💳 Payment Option</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              type="button"
              onClick={() => setPaymentOption("later")}
              className={`p-8 rounded-3xl border-4 transition-all transform hover:scale-105 text-left ${
                paymentOption === "later"
                  ? "border-emerald-500 bg-emerald-50 shadow-xl scale-105"
                  : "border-gray-300 bg-white hover:border-emerald-300 shadow-lg"
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-6 h-6 rounded-full border-4 mr-4 ${
                  paymentOption === "later" ? "border-emerald-500 bg-emerald-500" : "border-gray-300"
                }`}>
                  {paymentOption === "later" && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                  )}
                </div>
                <h3 className="text-xl font-black text-gray-800">Pay at Appointment</h3>
              </div>
              <p className="text-gray-600 font-medium">
                💼 Pay when you arrive for your appointment. Cash, card, or e-transfer accepted.
              </p>
        
            </button>

            <button
              type="button"
              onClick={() => setPaymentOption("now")}
              className={`p-8 rounded-3xl border-4 transition-all transform hover:scale-105 text-left ${
                paymentOption === "now"
                  ? "border-purple-500 bg-purple-50 shadow-xl scale-105"
                  : "border-gray-300 bg-white hover:border-purple-300 shadow-lg"
              }`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-6 h-6 rounded-full border-4 mr-4 ${
                  paymentOption === "now" ? "border-purple-500 bg-purple-500" : "border-gray-300"
                }`}>
                  {paymentOption === "now" && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                  )}
                </div>
                <h3 className="text-xl font-black text-gray-800">Pay Now Online</h3>
              </div>
              <p className="text-gray-600 font-medium">
                🚀 Secure your spot instantly with online payment. Get confirmation immediately.
              </p>
              <div className="mt-4 text-purple-600 font-bold">
                🎯 Guaranteed Booking
              </div>
            </button>
          </div>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`text-center p-4 rounded-2xl font-bold text-lg ${
            submitMessage.includes('confirmed') || submitMessage.includes('🎉') 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {submitMessage}
          </div>
        )}

        <div className="pt-10 text-center">
          <button 
            onClick={handleApiSubmit}
            disabled={isSubmitting}
            className={`group relative ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : paymentOption === "now"
                ? 'bg-purple-500 hover:bg-purple-600 cursor-pointer hover:scale-110 hover:rotate-3'
                : 'bg-emerald-500 hover:bg-emerald-600 cursor-pointer hover:scale-110 hover:rotate-3'
            } text-white px-16 py-6 rounded-full font-black text-2xl transition-all duration-500 transform shadow-2xl hover:shadow-3xl`}
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
                } rounded-full blur-lg opacity-75 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500`}></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              </>
            )}
          </button>
          <p className="text-gray-600 mt-6 font-medium">
            {paymentOption === "now" 
              ? "Secure payment processing • Instant confirmation 🔒" 
              : "We'll confirm within 30 minutes! 💫"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;