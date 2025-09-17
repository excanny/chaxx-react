import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white fixed w-full z-50 shadow">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <h1 className="text-2xl font-bold text-yellow-600">✂️ BarberPro</h1>
        <ul className="hidden md:flex space-x-8 text-gray-700">
          <li><a href="#home" className="hover:text-yellow-600 transition">Home</a></li>
          <li><a href="#gallery" className="hover:text-yellow-600 transition">Gallery</a></li>
          <li><a href="#booking" className="hover:text-yellow-600 transition">Booking</a></li>
          <li><a href="#contact" className="hover:text-yellow-600 transition">Contact</a></li>
        </ul>
        <button className="md:hidden text-yellow-600">☰</button>
      </div>
    </nav>
  );
}
