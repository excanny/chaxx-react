import { useState, useEffect } from 'react';

const AdminBlockSlots = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [isFullDay, setIsFullDay] = useState(false);
  const [message, setMessage] = useState("");
  const [blockedSlots, setBlockedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewDate, setViewDate] = useState("");

  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  const to12Hour = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  const generateTimeSlots = (date) => {
    if (!date) return [];
    
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    const startHour = 9;
    const endHour = isWeekend ? 20 : 18;
    
    const slots = [];
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(to12Hour(hour, 0));
      slots.push(to12Hour(hour, 30));
    }
    
    return slots;
  };

  const timeSlots = generateTimeSlots(selectedDate);

  const fetchBlockedSlots = async (date) => {
    setLoading(true);
    try {
      const url = date 
        ? `${baseUrl}/admin/blocked-slots?date=${date}`
        : `${baseUrl}/admin/blocked-slots`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBlockedSlots(data.blocked_slots);
      } else {
        console.error('Failed to fetch blocked slots');
      }
    } catch (error) {
      console.error('Error fetching blocked slots:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedSlots(viewDate);
  }, [viewDate]);

  const handleBlockSlot = async () => {
    if (!selectedDate) {
      setMessage("❌ Please select a date");
      return;
    }

    if (!isFullDay && !selectedTime) {
      setMessage("❌ Please select a time slot or choose 'Block Entire Day'");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${baseUrl}/admin/block-slot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: selectedDate,
          time_slot: isFullDay ? null : selectedTime,
          reason: blockReason || 'Unavailable',
          is_full_day: isFullDay
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        setSelectedDate("");
        setSelectedTime("");
        setBlockReason("");
        setIsFullDay(false);
        fetchBlockedSlots(viewDate);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Error blocking slot:', error);
      setMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnblockSlot = async (date, timeSlot, isFullDayBlock) => {
    if (!confirm(`Are you sure you want to unblock ${isFullDayBlock ? 'the entire day' : timeSlot} on ${date}?`)) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/admin/unblock-slot`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date,
          time_slot: timeSlot,
          is_full_day: isFullDayBlock
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        fetchBlockedSlots(viewDate);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Error unblocking slot:', error);
      setMessage("❌ Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  const groupedBlockedSlots = blockedSlots.reduce((acc, slot) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-cyan-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            🚫 Block Time Slots
          </h1>
          <p className="text-gray-600 mb-6">Manage unavailable dates and times for bookings</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                📅 Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime("");
                }}
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg font-semibold focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                📝 Reason (Optional)
              </label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="e.g., Holiday, Maintenance"
                className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-lg font-semibold focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFullDay}
                onChange={(e) => {
                  setIsFullDay(e.target.checked);
                  if (e.target.checked) {
                    setSelectedTime("");
                  }
                }}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-lg font-bold text-gray-800">
                🔒 Block Entire Day
              </span>
            </label>
            <p className="text-sm text-gray-600 ml-8 mt-1">
              This will make all time slots unavailable for the selected date
            </p>
          </div>

          {selectedDate && !isFullDay && (
            <div className="mb-6">
              <label className="block text-lg font-bold text-gray-800 mb-3">
                ⏰ Select Time Slot to Block
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`px-3 py-3 rounded-xl font-bold text-sm transition-all transform hover:scale-105 ${
                      selectedTime === time
                        ? "bg-red-500 border-2 border-red-600 text-white shadow-lg"
                        : "bg-white border-2 border-gray-300 text-gray-700 hover:border-red-400 hover:bg-red-50"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {message && (
            <div className={`p-4 rounded-xl font-semibold mb-6 ${
              message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleBlockSlot}
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            } text-white px-8 py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg`}
          >
            {loading ? 'Processing...' : isFullDay ? '🚫 Block Entire Day' : '🚫 Block Time Slot'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              📋 Blocked Slots
            </h2>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Filter by Date:</label>
              <input
                type="date"
                value={viewDate}
                onChange={(e) => setViewDate(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-purple-600 font-semibold">Loading...</span>
            </div>
          ) : blockedSlots.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl font-semibold">No blocked slots found</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedBlockedSlots).sort().map(([date, slots]) => (
                <div key={date} className="border-2 border-gray-200 rounded-xl p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    📅 {new Date(date + 'T00:00:00').toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {slots.map((slot) => (
                      <div
                        key={slot._id}
                        className={`${
                          slot.is_full_day ? 'bg-red-100 border-red-400' : 'bg-orange-50 border-orange-300'
                        } border-2 rounded-lg p-3 flex items-center justify-between`}
                      >
                        <div>
                          <div className="font-bold text-gray-800">
                            {slot.is_full_day ? '🔒 Entire Day' : `🕐 ${slot.time_slot}`}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {slot.reason}
                          </div>
                        </div>
                        <button
                          onClick={() => handleUnblockSlot(slot.date, slot.time_slot, slot.is_full_day)}
                          className="bg-white hover:bg-red-50 text-red-600 font-bold px-3 py-2 rounded-lg border-2 border-red-300 hover:border-red-500 transition-all text-sm"
                        >
                          Unblock
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBlockSlots;