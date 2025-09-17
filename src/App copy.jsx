// import React from "react";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Gallery from "./components/Gallery";
// import Booking from "./components/Booking";
// import Footer from "./components/Footer";

// export default function App() {
//   return (
//     <div className="bg-white text-gray-900 font-sans">
//       <Navbar />
//       <Hero />
//       <Gallery />
//       <Booking />
//       <Footer />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";

export default function App() {
  // Animation states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Booking Logic
  const dailySlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  const bookedSlots = {
    "2025-09-17": ["11:00", "15:00"],
    "2025-09-18": ["10:00", "14:00"],
    "2025-09-19": ["09:00", "16:00"],
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const services = [
    { name: "DISCOUNTED HAIRCUT", price: "$20", originalPrice: "$25", duration: "45 min", popular: true },
    { name: "PREMIUM FADE", price: "$30", duration: "60 min" },
    { name: "BEARD SCULPTING", price: "$15", duration: "30 min" },
    { name: "HAIR STYLING", price: "$25", duration: "45 min" },
    { name: "HAIR DYE", price: "$40", duration: "90 min" },
    { name: "FULL SERVICE", price: "$50", duration: "120 min", premium: true },
  ];

  const heroImages = [
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=1200",
    "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200",
    "https://images.unsplash.com/photo-1562004760-aceed7bb0fe3?q=80&w=1200"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const availableSlots = dailySlots.map((time) => {
    const isBooked = bookedSlots[selectedDate]?.includes(time);
    return { time, isBooked };
  });

  const handleSubmit = () => {
    if (!preferredTime || !selectedService) {
      alert("⚠️ Please select a service and available time slot before booking.");
      return;
    }
    alert(`✅ Booking confirmed!\nService: ${selectedService}\nDate: ${selectedDate}\nTime: ${preferredTime}`);
  };

  const galleryItems = [
    {
      title: "Precision Fade",
      image: "https://images.unsplash.com/photo-1610173826011-94690e18dfe9?q=80&w=800",
      category: "LATEST HAIRCUT"
    },
    {
      title: "Classic Pompadour", 
      image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381c?q=80&w=800",
      category: "HAIR STYLING"
    },
    {
      title: "Modern Texture",
      image: "https://images.unsplash.com/photo-1613601642776-8dce7c2a27cd?q=80&w=800", 
      category: "LATEST HAIRCUT"
    },
    {
      title: "Sharp Lines",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800",
      category: "HAIR STYLING"
    },
    {
      title: "Beard Design",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800",
      category: "BEARD SCULPTING"
    },
    {
      title: "Color Work",
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800",
      category: "HAIR DYE"
    }
  ];

  return (
    <div className="bg-white text-gray-900 font-sans overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md fixed w-full z-50 border-b border-red-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-b from-red-500 via-white to-blue-600 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                  <span className="text-gray-800 font-bold text-xl">✂</span>
                </div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold">
                <span className="text-red-600 font-script italic">Chaxx</span>
              </h1>
              <p className="text-xs text-gray-600 -mt-1 tracking-widest">BARBERSHOP</p>
            </div>
          </div>
          
          <ul className="hidden md:flex space-x-8 text-gray-700">
            {['Home', 'Services', 'Gallery', 'Booking', 'Contact'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="hover:text-red-600 transition-all duration-300 relative group font-medium tracking-wide text-sm uppercase"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-500 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-red-600 text-2xl hover:text-red-700 transition-colors"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-2000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={img} 
                alt={`Barbershop ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-red-100/80"></div>
            </div>
          ))}
          
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100/20 to-transparent animate-pulse"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
          {/* Special Offer Badge */}
          <div className="inline-flex items-center space-x-3 bg-red-50 border border-red-300 rounded-full px-6 py-2 mb-8 backdrop-blur-sm shadow-lg">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
            <span className="text-red-700 font-medium tracking-wide text-sm">SPECIAL OFFER AVAILABLE</span>
          </div>

          <div className="mb-8">
            <h1 className="text-8xl md:text-9xl font-black mb-4 leading-none tracking-tight">
              <span className="block bg-gradient-to-r from-gray-800 via-gray-900 to-gray-700 bg-clip-text text-transparent">
                DISCOUNTED
              </span>
              <span className="text-6xl md:text-7xl block mt-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                HAIRCUT
              </span>
            </h1>
            <div className="flex items-center justify-center space-x-6 mt-6">
              <div className="flex items-center space-x-2">
                <span className="text-red-500 text-2xl">❤️</span>
                <span className="text-4xl font-bold text-gray-800">2</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500 text-2xl">💬</span>
                <span className="text-4xl font-bold text-gray-800">0</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <span className="text-6xl md:text-8xl font-black text-red-600 italic block mb-2">$20</span>
            <p className="text-xl text-gray-700 mb-4">Regular Price: <span className="line-through">$25</span></p>
          </div>

          {/* Services Tags */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {['LATEST HAIRCUT', 'HAIR STYLING', 'HAIR DYE'].map((service) => (
              <span 
                key={service}
                className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-full text-sm font-medium text-gray-700 hover:text-gray-900 hover:border-red-400 hover:bg-red-50 transition-all duration-300 shadow-md"
              >
                {service}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <a
              href="#booking"
              className="group bg-gradient-to-r from-red-600 to-red-700 px-10 py-4 rounded-full font-bold text-lg text-white hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/30"
            >
              <span className="flex items-center justify-center space-x-3">
                <span>BOOK NOW</span>
                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
              </span>
            </a>
            
            <div className="flex items-center justify-center space-x-4 bg-blue-50 border border-blue-300 px-6 py-4 rounded-full shadow-lg">
              <span className="text-blue-700 font-medium">FREE</span>
              <div className="text-left text-sm">
                <p className="text-gray-800 font-semibold">REFRESHMENTS</p>
                <p className="text-gray-600">& MUSIC</p>
              </div>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="text-center">
            <p className="text-gray-600 text-sm tracking-widest mb-2">VENUE</p>
            <p className="text-red-600 font-bold text-xl mb-4">3944 CASTLE ROAD</p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-700">
              <span>FOR MORE INFO CALL:</span>
              <span className="text-gray-900 font-bold">+1 (306) 216-7657</span>
              <span className="text-red-600">+1 (306) 569-6803</span>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 opacity-30">
          <div className="w-20 h-20 border-2 border-red-400 rounded-full animate-spin"></div>
        </div>
        <div className="absolute top-20 right-10 opacity-30">
          <div className="w-16 h-16 border-2 border-blue-400 rounded-full animate-pulse"></div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent">
              SERVICES
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Professional barbering services with premium quality and attention to detail
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={service.name}
                className={`group relative bg-white rounded-3xl p-8 border transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  service.popular 
                    ? 'border-red-300 shadow-red-200/50 shadow-xl' 
                    : service.premium
                    ? 'border-yellow-300 shadow-yellow-200/50 shadow-xl'
                    : 'border-gray-200 hover:border-red-300 shadow-lg hover:shadow-xl'
                }`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      POPULAR
                    </span>
                  </div>
                )}
                
                {service.premium && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      PREMIUM
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                    <span className="text-3xl text-white font-bold">✂</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-wide">{service.name}</h3>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-black text-red-600">{service.price}</span>
                    {service.originalPrice && (
                      <span className="ml-3 text-lg text-gray-400 line-through">{service.originalPrice}</span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">{service.duration}</p>
                  
                  <button className="w-full bg-red-50 border border-red-300 text-red-700 px-6 py-3 rounded-full font-semibold hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300">
                    Select Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
              OUR WORK
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Precision cuts and styling that speak for themselves
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item, index) => (
              <div
                key={item.title}
                className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-red-300 transition-all duration-500 hover:scale-105 shadow-lg hover:shadow-2xl"
              >
                <div className="aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-center transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="inline-block bg-red-600/20 border border-red-500/50 px-3 py-1 rounded-full text-red-300 text-xs font-medium mb-3 backdrop-blur-sm">
                      {item.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                    <button className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-full font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg">
                      Book This Style
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-800 to-red-600 bg-clip-text text-transparent">
              BOOK APPOINTMENT
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Secure your spot for the premium Chaxx experience
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-gray-700">
              <span className="text-red-600 font-bold text-lg">+1 (306) 216-7657</span>
              <span className="text-red-600 font-bold text-lg">+1 (306) 569-6803</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 border border-gray-200 shadow-2xl">
            {/* Service Selection */}
            <div className="mb-10">
              <label className="block text-2xl font-bold mb-6 text-gray-800">SELECT SERVICE</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.slice(0, 6).map((service) => (
                  <button
                    key={service.name}
                    onClick={() => setSelectedService(service.name)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      selectedService === service.name
                        ? "border-red-500 bg-red-50 text-gray-900 shadow-lg shadow-red-200/50"
                        : "border-gray-200 hover:border-red-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <h4 className="font-bold text-lg mb-1">{service.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className="text-red-600 font-bold">{service.price}</span>
                      {service.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">{service.originalPrice}</span>
                      )}
                      <span className="text-gray-600 text-sm">• {service.duration}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
              <div>
                <label className="block text-2xl font-bold mb-6 text-gray-800">CHOOSE DATE</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setPreferredTime("");
                  }}
                  className="w-full bg-gray-50 border-2 border-gray-300 rounded-2xl px-6 py-4 text-gray-800 text-lg focus:ring-2 focus:ring-red-400 focus:outline-none focus:border-red-500 transition-all duration-300"
                />
              </div>

              {selectedDate && (
                <div>
                  <label className="block text-2xl font-bold mb-6 text-gray-800">AVAILABLE TIMES</label>
                  <div className="grid grid-cols-3 gap-3">
                    {availableSlots.map(({ time, isBooked }) => (
                      <button
                        key={time}
                        disabled={isBooked}
                        onClick={() => setPreferredTime(time)}
                        className={`py-3 px-2 rounded-xl font-bold transition-all duration-300 border-2 ${
                          isBooked
                            ? "bg-red-100 text-red-600 cursor-not-allowed border-red-200"
                            : preferredTime === time
                            ? "bg-red-600 text-white border-red-500 transform scale-105 shadow-lg shadow-red-300/50"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 border-blue-200 hover:border-blue-300"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Form */}
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xl font-bold mb-3 text-gray-800">FULL NAME</label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full bg-gray-50 border-2 border-gray-300 rounded-2xl px-6 py-4 text-gray-800 text-lg placeholder-gray-500 focus:ring-2 focus:ring-red-400 focus:outline-none focus:border-red-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-3 text-gray-800">PHONE NUMBER</label>
                  <input
                    type="tel"
                    placeholder="(306) 216-7657"
                    className="w-full bg-gray-50 border-2 border-gray-300 rounded-2xl px-6 py-4 text-gray-800 text-lg placeholder-gray-500 focus:ring-2 focus:ring-red-400 focus:outline-none focus:border-red-500 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xl font-bold mb-3 text-gray-800">SELECTED SERVICE</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedService}
                    placeholder="Choose service above"
                    className="w-full bg-red-50 border-2 border-red-300 rounded-2xl px-6 py-4 text-red-700 text-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xl font-bold mb-3 text-gray-800">PREFERRED TIME</label>
                  <input
                    type="text"
                    readOnly
                    value={preferredTime}
                    placeholder="Select time above"
                    className="w-full bg-red-50 border-2 border-red-300 rounded-2xl px-6 py-4 text-red-700 text-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <button
                  onClick={handleSubmit}
                  className="group bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-5 rounded-full font-bold text-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-red-500/30"
                >
                  <span className="flex items-center justify-center space-x-3">
                    <span>CONFIRM BOOKING</span>
                    <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                  </span>
                </button>
                <button className="border-2 border-blue-500 text-blue-600 px-12 py-5 rounded-full font-bold text-xl hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 transition-all duration-300">
                  CALL TO BOOK
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-b from-red-500 via-white to-blue-600 p-0.5">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                    <span className="text-gray-800 font-bold text-2xl">✂</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold">
                    <span className="text-red-600 font-script italic">Chaxx</span>
                  </h3>
                  <p className="text-sm text-gray-600 tracking-widest">BARBERSHOP</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                Premium barbershop experience with discounted rates
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="text-2xl font-bold text-red-600 mb-6">CONTACT</h4>
              <div className="space-y-4 text-gray-700">
                <p className="flex items-center justify-center space-x-3">
                  <span className="text-red-600">📍</span>
                  <span>3944 Castle Road</span>
                </p>
                <p className="flex items-center justify-center space-x-3">
                  <span className="text-red-600">📞</span>
                  <span>+1 (306) 216-7657</span>
                </p>
                <p className="flex items-center justify-center space-x-3">
                  <span className="text-red-600">📞</span>
                  <span>+1 (306) 569-6803</span>
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <h4 className="text-2xl font-bold text-red-600 mb-6">HOURS</h4>
              <div className="space-y-3 text-gray-700">
                <p>Monday - Friday: 9:00 AM - 8:00 PM</p>
                <p>Saturday: 8:00 AM - 7:00 PM</p>
                <p>Sunday: 10:00 AM - 6:00 PM</p>
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <p className="text-blue-600 font-semibold">Walk-ins Welcome</p>
                  <p className="text-sm text-gray-600 mt-2">Free refreshments & music</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-300 pt-12 text-center">
            <div className="mb-6">
              <div className="flex justify-center space-x-8 text-gray-600">
                <span className="hover:text-red-600 transition-colors cursor-pointer">Instagram</span>
                <span className="hover:text-red-600 transition-colors cursor-pointer">Facebook</span>
                <span className="hover:text-red-600 transition-colors cursor-pointer">TikTok</span>
              </div>
            </div>
            <p className="text-gray-500 text-lg">
              © 2025 Chaxx Barbershop. All rights reserved.
            </p>
            <p className="text-red-600 font-bold text-xl mt-2 italic">
              ...a cut above the rest
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}