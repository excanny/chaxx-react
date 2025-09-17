import React from "react";

export default function Hero() {
  return (
    <section
      id="home"
      className="h-screen flex items-center justify-center text-center bg-gradient-to-r from-yellow-50 to-white px-6"
    >
      <div>
        <h2 className="text-5xl md:text-6xl font-bold mb-4 text-gray-800">
          Look Sharp. Feel Fresh.
        </h2>
        <p className="text-gray-600 mb-8">
          Premium barbershop experience with expert stylists.
        </p>
        <a
          href="#booking"
          className="bg-yellow-500 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-400 transition"
        >
          Book Your Cut
        </a>
      </div>
    </section>
  );
}
