import { useState, useEffect } from 'react';

const BookingForm = ({ selectedDate, setSelectedDate, preferredTime, setPreferredTime }) => {
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [paymentOption, setPaymentOption] = useState("later");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingMode, setBookingMode] = useState("single");
  const [groupBookings, setGroupBookings] = useState([]);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Convert 24hr to 12hr AM/PM format
  const to12Hour = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  // Convert 12hr AM/PM to 24hr format for backend
  const to24Hour = (time12hr) => {
    const [time, period] = time12hr.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    return `${hour.toString().padStart(2, '0')}:${minutes}:00`;
  };

// const generateTimeSlots = (date) => {
//     if (!date) return [];
    
//     // Create date object and get day of week (0 = Sunday, 6 = Saturday)
//     const dateObj = new Date(date + 'T00:00:00');
//     const dayOfWeek = dateObj.getDay();
//     const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
//     const startHour = 9;
//     const endHour = isWeekend ? 20 : 18; // 8 PM for weekends, 6 PM for weekdays
    
//     const slots = [];
//     // Loop up to and including the last hour to get the :30 slot
//     for (let hour = startHour; hour < endHour; hour++) {
//       slots.push(to12Hour(hour, 0));
//       slots.push(to12Hour(hour, 30));
//     }
    
//     return slots;
// };

const generateTimeSlots = (date) => {
    if (!date) return [];
    
    // Create date object and get day of week (0 = Sunday, 6 = Saturday)
    const dateObj = new Date(date + 'T00:00:00');
    const dayOfWeek = dateObj.getDay();
    const isSunday = dayOfWeek === 0;
    
    // Set hours based on day of week
    const startHour = isSunday ? 13 : 9; // 1 PM for Sunday, 9 AM for others
    const endHour = 20; // 8 PM for all days
    
    const slots = [];
    // Loop up to and including the last hour to get the :30 slot
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(to12Hour(hour, 0));
      slots.push(to12Hour(hour, 30));
    }
    
    return slots;
};

  const dailySlots = generateTimeSlots(selectedDate);

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  const isTimeInPast = (timeSlot) => {
    if (selectedDate !== today) return false;
    
    const [time, period] = timeSlot.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let hour = hours;
    
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    
    if (hour < currentHour) return true;
    if (hour === currentHour && minutes <= currentMinute) return true;
    return false;
  };

  const isSlotTaken = (timeSlot) => {
    return groupBookings.some(booking => booking.time === timeSlot);
  };

  const isSlotSelected = (timeSlot) => {
    if (bookingMode === "single") {
      return preferredTime === timeSlot;
    } else {
      return isSlotTaken(timeSlot);
    }
  };

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
        
        // Process the slots correctly - backend now returns AM/PM format
        const processedSlots = dailySlots.map((time) => {
          const isBooked = !data.available_slots.includes(time);
          const isPast = isTimeInPast(time);
          const isTaken = isSlotTaken(time);
          return { time, isBooked, isPast, isTaken };
        });

        setAvailableSlots(processedSlots);
      } else {
        console.error('Failed to fetch available slots');
        // Fallback: show all slots as available (not booked)
        const fallbackSlots = dailySlots.map((time) => {
          const isPast = isTimeInPast(time);
          const isTaken = isSlotTaken(time);
          return { time, isBooked: false, isPast, isTaken };
        });
        setAvailableSlots(fallbackSlots);
      }
      
    } catch (error) {
      console.error('Error fetching available slots:', error);
      // Fallback: show all slots as available
      const fallbackSlots = dailySlots.map((time) => {
        const isPast = isTimeInPast(time);
        const isTaken = isSlotTaken(time);
        return { time, isBooked: false, isPast, isTaken };
      });
      setAvailableSlots(fallbackSlots);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Fetch slots only when date changes
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDate]);

  // Update slot states when group bookings are added/removed (without refetching)
  useEffect(() => {
    if (availableSlots.length > 0 && bookingMode === "group") {
      setAvailableSlots(prevSlots => 
        prevSlots.map(slot => ({
          ...slot,
          isTaken: groupBookings.some(booking => booking.time === slot.time)
        }))
      );
    }
  }, [groupBookings.length, bookingMode]);

  const handleTimeSlotClick = (time) => {
    if (bookingMode === "single") {
      setPreferredTime(time);
    } else {
      // For group mode, directly add to group bookings
      const newBooking = {
        id: Date.now(),
        time: time,
        name: "",
        phone: "",
        email: ""
      };
      setGroupBookings([...groupBookings, newBooking]);
      setSubmitMessage("");
      
      // Update slot state immediately
      setAvailableSlots(prevSlots => 
        prevSlots.map(slot => 
          slot.time === time 
            ? { ...slot, isTaken: true }
            : slot
        )
      );
    }
  };

  const removeBookingFromGroup = (id) => {
    const bookingToRemove = groupBookings.find(b => b.id === id);
    setGroupBookings(groupBookings.filter(b => b.id !== id));
    
    // Update slot state immediately
    if (bookingToRemove) {
      setAvailableSlots(prevSlots => 
        prevSlots.map(slot => 
          slot.time === bookingToRemove.time 
            ? { ...slot, isTaken: false }
            : slot
        )
      );
    }
  };

  const updateGroupBooking = (id, field, value) => {
    setGroupBookings(groupBookings.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    ));
  };

  const handleApiSubmit = async () => {
    if (bookingMode === "single") {
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
      if (!email.trim()) {
        setSubmitMessage("Please enter your email address");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setSubmitMessage("Please enter a valid email address");
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
        const booking = {
          customer_name: customerName.trim(),
          phone_number: phoneDigits,
          email: email.trim(),
          appointment_time: `${selectedDate} ${to24Hour(preferredTime)}`,
          pay_now: paymentOption === "now"
        };

        const response = await fetch(`${baseUrl}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(booking)
        });

        if (response.ok) {
          const result = await response.json();
          setSubmitMessage("🎉 Booking confirmed! We'll contact you soon.");
          setCustomerName("");
          setPhoneNumber("");
          setEmail("");
          setPaymentOption("later");
          setSelectedDate("");
          setPreferredTime("");
          setAvailableSlots([]);
          
          console.log('Booking successful:', result);
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Booking failed:', errorData);
          setSubmitMessage("❌ Booking failed. Please try again or contact us.");
        }
      } catch (error) {
        console.error('Booking error:', error);
        setSubmitMessage("❌ Network error. Please check your connection and try again.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Group booking validation
      if (!selectedDate) {
        setSubmitMessage("Please select a date");
        return;
      }
      if (groupBookings.length === 0) {
        setSubmitMessage("Please add at least one booking to your group");
        return;
      }

      for (let booking of groupBookings) {
        if (!booking.name.trim()) {
          setSubmitMessage(`Please enter name for ${booking.time} slot`);
          return;
        }
        if (!booking.phone.trim()) {
          setSubmitMessage(`Please enter phone number for ${booking.name || booking.time + ' slot'}`);
          return;
        }
        const guestPhoneDigits = booking.phone.replace(/\D/g, '');
        if (guestPhoneDigits.length !== 10) {
          setSubmitMessage(`Please enter a valid 10-digit phone number for ${booking.name || booking.time + ' slot'}`);
          return;
        }
        if (!booking.email.trim()) {
          setSubmitMessage(`Please enter email for ${booking.name || booking.time + ' slot'}`);
          return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(booking.email.trim())) {
          setSubmitMessage(`Please enter a valid email for ${booking.name || booking.time + ' slot'}`);
          return;
        }
      }

      setIsSubmitting(true);
      setSubmitMessage("");

      try {
        const bookings = groupBookings.map(booking => ({
          customer_name: booking.name.trim(),
          phone_number: booking.phone.replace(/\D/g, ''),
          email: booking.email.trim(),
          appointment_time: `${selectedDate} ${to24Hour(booking.time)}`,
          pay_now: paymentOption === "now"
        }));

        console.log('Submitting group bookings:', bookings);

        // ✅ FIXED: Send all bookings in ONE request
        const response = await fetch(`${baseUrl}/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookings) // Send array directly
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Group booking successful:', result);
          
          // Handle different response scenarios
          if (result.success) {
            const successCount = result.bookings?.length || result.summary?.successful || bookings.length;
            const failedCount = result.conflicts?.length || result.summary?.failed || 0;
            
            if (failedCount > 0) {
              // Partial success
              setSubmitMessage(
                `⚠️ ${successCount} booking(s) confirmed, but ${failedCount} slot(s) were already taken. Please check and try again.`
              );
            } else {
              // Full success
              setSubmitMessage(
                `🎉 Group booking confirmed for ${successCount} ${successCount === 1 ? 'person' : 'people'}! We'll contact you soon.`
              );
              
              // Clear form only on full success
              setCustomerName("");
              setPhoneNumber("");
              setEmail("");
              setPaymentOption("later");
              setSelectedDate("");
              setPreferredTime("");
              setAvailableSlots([]);
              setGroupBookings([]);
            }
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.error('Group booking failed:', errorData);
          
          if (response.status === 409) {
            // All slots were taken
            setSubmitMessage(
              `❌ All selected time slots are already booked. Please choose different times.`
            );
          } else {
            setSubmitMessage(
              `❌ Booking failed. ${errorData.message || 'Please try again or contact us.'}`
            );
          }
        }
      } catch (error) {
        console.error('Booking error:', error);
        setSubmitMessage("❌ Network error. Please check your connection and try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="bg-gray-50 rounded-2xl p-8 shadow-xl border-2 border-gray-200 relative overflow-hidden">
      <div className="absolute top-4 left-4 w-8 h-8 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-4 right-4 w-10 h-10 bg-cyan-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>

      <div className="mb-8 relative z-10">
        <label className="block text-lg font-bold text-gray-800 mb-3">
          🎯 Booking Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              setBookingMode("single");
              setGroupBookings([]);
              setPreferredTime("");
            }}
            className={`p-4 rounded-xl border-2 transition-all transform hover:scale-102 ${
              bookingMode === "single"
                ? "border-purple-500 bg-purple-50 shadow-lg"
                : "border-gray-300 bg-white hover:border-purple-300"
            }`}
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="text-md font-bold text-gray-800">Single Booking</h3>
            <p className="text-xs text-gray-600 mt-1">Book one appointment</p>
          </button>
          
          <button
            type="button"
            onClick={() => {
              setBookingMode("group");
              setPreferredTime("");
            }}
            className={`p-4 rounded-xl border-2 transition-all transform hover:scale-102 ${
              bookingMode === "group"
                ? "border-cyan-500 bg-cyan-50 shadow-lg"
                : "border-gray-300 bg-white hover:border-cyan-300"
            }`}
          >
            <div className="text-3xl mb-2">👥</div>
            <h3 className="text-md font-bold text-gray-800">Group Booking</h3>
            <p className="text-xs text-gray-600 mt-1">Book multiple slots</p>
          </button>
        </div>
      </div>

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
            setGroupBookings([]);
          }}
          className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg font-semibold focus:border-purple-500 focus:outline-none transition-all bg-white shadow-md hover:shadow-lg"
        />
        <div className="mt-3 bg-amber-50 border-2 border-amber-300 rounded-lg p-3 flex items-start gap-2">
          <span className="text-amber-600 text-lg">⏱️</span>
          <p className="text-sm text-amber-800">
            <span className="font-bold">Please arrive on time.</span> A $5 extra fee applies for arrivals more than 10 minutes late.
          </p>
        </div>
      </div>

      {selectedDate && (
        <div className="mb-8 relative z-10">
          <label className="block text-lg font-bold text-cyan-600 mb-2">
            ⏰ {bookingMode === "single" ? "Choose Your Time" : "Select Time Slots"}
          </label>
          <p className="text-sm text-gray-600 mb-4">
            {bookingMode === "single" 
              ? "Select your preferred 30-minute time slot."
              : "Click time slots to add them to your group booking."}
          </p>
          
          {loadingSlots ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-cyan-600 font-semibold">Loading available times...</span>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
              {availableSlots.map(({ time, isBooked, isPast, isTaken }) => {
                const selected = isSlotSelected(time);
                const isDisabled = isBooked || isPast || (bookingMode === "group" && selected);
                return (
                  <button
                    key={time}
                    disabled={isDisabled}
                    onClick={() => handleTimeSlotClick(time)}
                    className={`px-2 py-3 rounded-xl font-bold text-xs transition-all transform hover:scale-105 ${
                      isBooked || isPast
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : selected
                        ? "bg-green-500 border-2 border-green-600 text-white shadow-lg scale-105 cursor-not-allowed"
                        : "bg-white border-2 border-purple-200 text-purple-600 hover:border-purple-500 hover:bg-purple-50 shadow-md hover:shadow-lg"
                    }`}
                    title={isPast ? "Time has passed" : isBooked ? "Already booked" : selected ? "Selected" : "Available"}
                  >
                    {time}
                    {isPast && <span className="block text-xs">Past</span>}
                    {isBooked && !isPast && <span className="block text-xs">Booked</span>}
                    {selected && <span className="block text-xs">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {bookingMode === "group" && groupBookings.length > 0 && (
        <div className="mb-8 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-lg font-bold text-cyan-600">
              📋 Your Group Bookings ({groupBookings.length})
            </label>
            <button
              onClick={() => setGroupBookings([])}
              className="text-sm text-red-600 hover:text-red-700 font-semibold underline"
            >
              Clear All
            </button>
          </div>
          <div className="mb-3 bg-blue-50 border-2 border-blue-300 rounded-lg p-3 flex items-start gap-2">
            <span className="text-blue-600 text-lg">📬</span>
            <p className="text-sm text-blue-800">
              We'll send appointment reminders to each slot owner's email address.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groupBookings.sort((a, b) => {
              const aTime = to24Hour(a.time);
              const bTime = to24Hour(b.time);
              return aTime.localeCompare(bTime);
            }).map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl p-3 border-2 border-cyan-200 shadow-md">
                <div className="flex items-center gap-2 mb-2">
                  <div className="font-bold text-cyan-600 text-sm whitespace-nowrap">
                    🕐 {booking.time}
                  </div>
                  <button
                    onClick={() => removeBookingFromGroup(booking.id)}
                    className="ml-auto text-red-500 hover:text-red-700 font-bold text-sm px-2 py-1 rounded-lg hover:bg-red-50 transition-all"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  value={booking.name}
                  onChange={(e) => updateGroupBooking(booking.id, 'name', e.target.value)}
                  placeholder="Slot owner name"
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-all mb-2"
                />
                <input
                  type="email"
                  value={booking.email}
                  onChange={(e) => updateGroupBooking(booking.id, 'email', e.target.value)}
                  placeholder="slotowner@example.com"
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-all mb-2"
                  title="We'll send appointment reminders to this email"
                />
                <input
                  type="tel"
                  value={booking.phone}
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
                    
                    updateGroupBooking(booking.id, 'phone', formatted);
                  }}
                  placeholder="(416) 123-4567"
                  maxLength={14}
                  className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6 relative z-10">
        {bookingMode === "single" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-md font-bold text-gray-800 mb-2">
                  ✨ Your Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full border-2 border-cyan-200 rounded-xl px-4 py-3 text-md font-semibold focus:border-cyan-500 focus:outline-none transition-all bg-white shadow-md hover:shadow-lg"
                />
              </div>
              <div>
                <label className="block text-md font-bold text-gray-800 mb-2">📧 Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full border-2 border-cyan-200 rounded-xl px-4 py-3 text-md font-semibold focus:border-cyan-500 focus:outline-none transition-all bg-white shadow-md hover:shadow-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-md font-bold text-gray-800 mb-2">📱 Contact Phone Number</label>
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
            <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-3 flex items-start gap-2">
              <span className="text-blue-600 text-lg">📬</span>
              <p className="text-sm text-blue-800">
                We'll send appointment reminders to your email address.
              </p>
            </div>
          </div>
        )}

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
                : bookingMode === "group"
                ? `Book ${groupBookings.length} Appointment${groupBookings.length !== 1 ? 's' : ''} 🚀`
                : 'Book My Appointment 🚀'
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