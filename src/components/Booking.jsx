import React, { useState } from "react";

const dailySlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
const bookedSlots = {
  "2025-09-17": ["11:00", "15:00"],
  "2025-09-18": ["10:00", "14:00"],
};

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");

  const availableSlots = dailySlots.map((time) => {
    const isBooked = bookedSlots[selectedDate]?.includes(time);
    return { time, isBooked };
  });

  const handleSubmit = (e) => {
    if (!preferredTime) {
      e.preventDefault();
      alert("⚠️ Please select an available time slot before booking.");
    }
  };

  return (
    <section id="booking" className="py-16 bg-white text-gray-900">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-3xl font-bold mb-4 text-gray-800">
          📅 Book Your Appointment
        </h3>
        <p className="text-gray-600 mb-8">
          Pick a date and choose from available time slots.
        </p>

        {/* Date Picker */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">Choose Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setPreferredTime("");
            }}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            required
          />
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 mb-10">
          {availableSlots.map(({ time, isBooked }) => (
            <button
              key={time}
              disabled={isBooked}
              onClick={() => setPreferredTime(time)}
              className={`px-4 py-2 rounded-lg ${
                isBooked
                  ? "bg-red-100 text-red-800 cursor-not-allowed"
                  : preferredTime === time
                  ? "bg-yellow-500 text-black font-semibold"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              {time}
            </button>
          ))}
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-left">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +234 800 123 4567"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Time</label>
            <input
              type="text"
              readOnly
              value={preferredTime}
              placeholder="Select from chart above"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 focus:outline-none"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition w-full sm:w-auto">
              Pay Online & Book
            </button>
            <button className="bg-gray-100 border border-yellow-500 text-yellow-600 px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 hover:text-black transition w-full sm:w-auto">
              Book & Pay at Shop
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
