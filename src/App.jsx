import React, { useState, useEffect } from "react";

export default function App() {
  const dailySlots = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];
  const bookedSlots = {
    "2025-09-17": ["11:00", "15:00"],
    "2025-09-18": ["10:00", "14:00"],
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const colorCombos = [
    { primary: "purple-600", accent: "purple-500", light: "purple-100" },
    { primary: "blue-600", accent: "blue-500", light: "blue-100" },
    { primary: "emerald-600", accent: "emerald-500", light: "emerald-100" },
    { primary: "orange-600", accent: "orange-500", light: "orange-100" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colorCombos.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const availableSlots = dailySlots.map((time) => {
    const isBooked = bookedSlots[selectedDate]?.includes(time);
    return { time, isBooked };
  });

  const handleSubmit = () => {
    if (!preferredTime) {
      alert("🎨 Please select an available time slot before booking!");
    } else {
      alert("🎉 Awesome! Your booking is confirmed! We'll contact you shortly.");
    }
  };

  const currentColor = colorCombos[currentColorIndex];

  return (
    <div className="bg-indigo-50 text-gray-900 font-sans overflow-hidden">
      {/* Navigation */}
      <nav className="bg-white bg-opacity-95 backdrop-blur-md border-b-2 border-purple-200 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="relative group">
              <div className={`w-14 h-14 bg-${currentColor.primary} rounded-3xl flex items-center justify-center transform rotate-12 shadow-xl transition-all duration-1000 group-hover:rotate-45 group-hover:scale-110`}>
                <span className="text-white text-2xl transform -rotate-12 group-hover:-rotate-45 transition-transform">✂️</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full"></div>
            </div>
            <div>
              <h1 className={`text-3xl font-black text-${currentColor.primary} transition-all duration-1000`}>
                VIBE CUTS
              </h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Creative Studio</p>
            </div>
          </div>
          <ul className="hidden md:flex space-x-8">
            {['Home', 'Vibes', 'Gallery', 'Book'].map((item, index) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`} 
                  className="relative text-gray-700 hover:text-purple-600 transition-all duration-300 font-bold text-lg group"
                >
                  {item}
                  <div className={`absolute -bottom-2 left-0 w-0 h-1 bg-${currentColor.primary} group-hover:w-full transition-all duration-500 rounded-full`}></div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                </a>
              </li>
            ))}
          </ul>
          <button className="md:hidden text-purple-600 text-3xl hover:rotate-90 transition-transform">🌈</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 px-6 overflow-hidden min-h-screen flex items-center">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
        </div>

        {/* Floating Icons */}
        <div className="absolute top-32 left-16 animate-bounce text-6xl filter drop-shadow-lg" style={{animationDelay: '0s'}}>🎨</div>
        <div className="absolute top-1/3 right-16 animate-bounce text-5xl filter drop-shadow-lg" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-1/3 left-20 animate-bounce text-4xl filter drop-shadow-lg" style={{animationDelay: '2s'}}>🌈</div>
        <div className="absolute bottom-40 right-32 animate-bounce text-5xl filter drop-shadow-lg" style={{animationDelay: '1.5s'}}>💫</div>
        <div className="absolute top-1/2 left-1/3 animate-bounce text-3xl filter drop-shadow-lg" style={{animationDelay: '0.5s'}}>🎭</div>
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-12">
            {/* Animated Badge */}
            <div className="inline-block mb-8 group cursor-pointer">
              <div className={`bg-${currentColor.primary} text-white px-8 py-4 rounded-full font-black text-lg uppercase tracking-widest shadow-2xl transform hover:scale-110 hover:rotate-3 transition-all duration-500 group-hover:shadow-3xl`}>
                <span className="mr-2">✨</span>
                Creative Hair Studio
                <span className="ml-2">✨</span>
              </div>
            </div>
            
            {/* Main Heading with Color Animation */}
            <h2 className="text-7xl md:text-9xl font-black mb-8 leading-none">
              <span className={`text-${currentColor.primary} transition-all duration-1000 transform hover:scale-110 inline-block`}>
                EXPRESS
              </span>
              <br />
              <span className="text-gray-800 transform hover:scale-105 inline-block transition-transform">
                YOURSELF
              </span>
            </h2>
            
            {/* Colorful Divider */}
            <div className="flex justify-center space-x-3 mb-10">
              <div className={`w-16 h-3 bg-purple-500 rounded-full transform hover:scale-110 transition-transform cursor-pointer`}></div>
              <div className={`w-16 h-3 bg-cyan-500 rounded-full transform hover:scale-110 transition-transform cursor-pointer`}></div>
              <div className={`w-16 h-3 bg-emerald-500 rounded-full transform hover:scale-110 transition-transform cursor-pointer`}></div>
              <div className={`w-16 h-3 bg-orange-500 rounded-full transform hover:scale-110 transition-transform cursor-pointer`}></div>
              <div className={`w-16 h-3 bg-pink-500 rounded-full transform hover:scale-110 transition-transform cursor-pointer`}></div>
            </div>
            
            <p className="text-2xl text-gray-700 mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
              We don't just cut hair – we create <span className="text-purple-600 font-bold">art</span>! 
              Bold colors, wild styles, and creative cuts that match your unique personality 🎨✨
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-16">
            <a 
              href="#book" 
              className={`group relative bg-${currentColor.primary} text-white px-12 py-6 rounded-full font-black text-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-110`}
            >
              <span className="relative z-10">Book Your Transformation 🚀</span>
              <div className={`absolute inset-0 bg-purple-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500`}></div>
            </a>
            
            <div className="flex items-center space-x-8 text-gray-700">
              <div className="text-center group cursor-pointer">
                <div className="flex items-center space-x-2 mb-2 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">⭐</span>
                  <span className="font-black text-2xl">4.9</span>
                </div>
                <p className="text-sm font-bold text-purple-600">5K+ Amazing Reviews</p>
              </div>
              <div className={`w-1 h-16 bg-${currentColor.primary} rounded-full`}></div>
              <div className="text-center group cursor-pointer">
                <div className={`text-3xl font-black mb-2 text-${currentColor.primary} group-hover:scale-110 transition-transform`}>
                  3K+
                </div>
                <p className="text-sm font-bold text-cyan-600">Happy Clients</p>
              </div>
            </div>
          </div>

          {/* Social Proof Avatars */}
          <div className="flex justify-center items-center space-x-4">
            <div className="flex -space-x-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-12 h-12 bg-${colorCombos[i % 4].primary} rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold hover:scale-125 transition-transform cursor-pointer`}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-lg font-bold text-gray-600 ml-4">
              Join thousands of happy clients! 💫
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="vibes" className="py-28 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-purple-400 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-cyan-400 rounded-full"></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-pink-400 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <div className={`inline-block bg-${currentColor.primary} text-white px-10 py-4 rounded-full font-black text-xl mb-8 transform hover:scale-110 hover:rotate-3 transition-all duration-500 shadow-xl cursor-pointer`}>
              🌈 Choose Your Vibe
            </div>
            <h3 className={`text-6xl font-black text-${currentColor.primary} mb-6 transition-all duration-1000`}>
              SIGNATURE SERVICES
            </h3>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto font-medium">
              From classic cuts to wild transformations – we've got the skills to match your wildest dreams! 🎨
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              { 
                name: "The Trendsetter", 
                price: "₦18,000", 
                time: "60 min", 
                color: "purple-500", 
                emoji: "🔥", 
                desc: "Modern cuts with creative flair and personality",
                features: ["Style consultation", "Premium products", "Photo session"]
              },
              { 
                name: "Color Explosion", 
                price: "₦25,000", 
                time: "90 min", 
                color: "cyan-500", 
                emoji: "🎨", 
                desc: "Bold colors and artistic styling that turns heads",
                features: ["Color matching", "Artistic design", "Maintenance kit"]
              },
              { 
                name: "Fresh Fade Pro", 
                price: "₦15,000", 
                time: "45 min", 
                color: "emerald-500", 
                emoji: "⚡", 
                desc: "Crisp fades with modern twists and clean lines",
                features: ["Precision cutting", "Beard styling", "Hot towel finish"]
              },
              { 
                name: "Total Makeover", 
                price: "₦35,000", 
                time: "120 min", 
                color: "orange-500", 
                emoji: "✨", 
                desc: "Complete style transformation that changes everything",
                features: ["Full consultation", "Cut & color", "Styling tutorial", "Product bundle"]
              }
            ].map((service) => (
              <div key={service.name} className="group relative bg-gray-50 p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 border-2 border-transparent hover:border-gray-200 overflow-hidden">
                <div className={`absolute inset-0 bg-${service.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`}></div>
                <div className="relative z-10 text-center">
                  <div className={`w-20 h-20 bg-${service.color} rounded-3xl flex items-center justify-center text-3xl mb-6 mx-auto shadow-xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 cursor-pointer`}>
                    {service.emoji}
                  </div>
                  <h4 className="text-2xl font-black text-gray-900 mb-3">{service.name}</h4>
                  <p className="text-gray-600 mb-4 italic font-medium">{service.desc}</p>
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <span className="text-sm bg-gray-200 px-4 py-2 rounded-full font-bold">{service.time}</span>
                  </div>
                  <div className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <span className={`w-2 h-2 bg-${service.color} rounded-full mr-3`}></span>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <p className={`text-4xl font-black text-${service.color}`}>{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-28 bg-purple-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <div className={`inline-block bg-cyan-600 text-white px-10 py-4 rounded-full font-black text-xl mb-8 transform hover:scale-110 hover:rotate-3 transition-all duration-500 shadow-xl cursor-pointer`}>
              📸 Style Showcase
            </div>
            <h3 className={`text-6xl font-black text-cyan-600 mb-6`}>
              CREATIVE GALLERY
            </h3>
            <p className="text-gray-600 text-xl font-medium">Check out some of our most vibrant transformations! 🌟</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { image: "https://images.unsplash.com/photo-1610173826011-94690e18dfe9?q=80&w=800", title: "Bold Fade", color: "purple-500" },
              { image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381c?q=80&w=800", title: "Textured Waves", color: "cyan-500" },
              { image: "https://images.unsplash.com/photo-1613601642776-8dce7c2a27cd?q=80&w=800", title: "Classic Modern", color: "emerald-500" },
              { image: "https://images.unsplash.com/photo-1622286346003-c4fda0cd2ba8?q=80&w=800", title: "Creative Cut", color: "orange-500" },
              { image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=800", title: "Beard Artistry", color: "yellow-500" },
              { image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800", title: "Full Transform", color: "pink-500" }
            ].map((item, index) => (
              <div key={index} className="group relative rounded-3xl overflow-hidden transform hover:scale-105 hover:rotate-1 transition-all duration-500 shadow-xl hover:shadow-2xl cursor-pointer">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-500">
                  <div className="absolute bottom-8 left-8 right-8 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <h4 className={`text-3xl font-black text-${item.color} mb-4`}>{item.title}</h4>
                    <button className={`bg-${item.color} text-white px-8 py-4 rounded-full font-black hover:shadow-xl transition-all transform hover:scale-110`}>
                      Book This Style 🎯
                    </button>
                  </div>
                </div>
                <div className={`absolute top-4 right-4 w-8 h-8 bg-${item.color} rounded-full flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity`}>
                  ✨
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="book" className="py-28 bg-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className={`inline-block bg-emerald-500 text-white px-10 py-4 rounded-full font-black text-xl mb-8 transform hover:scale-110 hover:rotate-3 transition-all duration-500 shadow-xl cursor-pointer`}>
              📅 Let's Create Magic
            </div>
            <h3 className={`text-6xl font-black text-emerald-600 mb-6`}>
              BOOK YOUR SLOT
            </h3>
            <p className="text-gray-600 text-xl font-medium">Ready for your transformation? Pick your date and time! ⚡</p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-12 shadow-2xl border-4 border-gray-200 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-6 left-6 w-12 h-12 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-6 right-6 w-16 h-16 bg-cyan-400 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>

            {/* Date Selection */}
            <div className="mb-10 relative z-10">
              <label className={`block text-2xl font-black text-purple-600 mb-4`}>
                🗓️ Pick Your Date
              </label>
              <input
                type="date"
                value={selectedDate}
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
                  {availableSlots.map(({ time, isBooked }) => (
                    <button
                      key={time}
                      disabled={isBooked}
                      onClick={() => setPreferredTime(time)}
                      className={`px-6 py-5 rounded-2xl font-black text-lg transition-all transform hover:scale-110 ${
                        isBooked
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : preferredTime === time
                          ? "bg-purple-500 text-white shadow-xl scale-110 rotate-3"
                          : "bg-white border-4 border-purple-200 text-purple-600 hover:border-purple-500 hover:bg-purple-50 shadow-lg hover:shadow-xl hover:rotate-1"
                      }`}
                    >
                      {time}
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
                    placeholder="What should we call you?"
                    className="w-full border-4 border-cyan-200 rounded-2xl px-8 py-5 text-xl font-bold focus:border-cyan-500 focus:outline-none transition-all bg-white shadow-lg hover:shadow-xl transform hover:scale-105"
                  />
                </div>
                <div>
                  <label className="block text-xl font-black text-gray-800 mb-4">📱 Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+234 xxx xxx xxxx"
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

              <div className="pt-10 text-center">
                <button 
                  onClick={handleSubmit}
                  className={`group relative bg-emerald-500 hover:bg-emerald-600 text-white px-16 py-6 rounded-full font-black text-2xl transition-all duration-500 transform hover:scale-110 hover:rotate-3 shadow-2xl hover:shadow-3xl cursor-pointer`}
                >
                  <span className="relative z-10">Book My Transformation 🚀</span>
                  <div className="absolute inset-0 bg-emerald-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500"></div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
                </button>
                <p className="text-gray-600 mt-6 font-medium">We'll confirm within 30 minutes! 💫</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 bg-pink-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className={`inline-block bg-pink-500 text-white px-10 py-4 rounded-full font-black text-xl mb-8 transform hover:scale-110 hover:rotate-3 transition-all duration-500 shadow-xl cursor-pointer`}>
              💬 Happy Vibes
            </div>
            <h3 className={`text-6xl font-black text-pink-600 mb-6`}>
              CLIENT LOVE
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Alex K.", rating: 5, text: "OMG! They totally transformed my look. I feel like a completely new person! The colors are incredible! 🔥", color: "purple-500" },
              { name: "Jordan M.", rating: 5, text: "Best barbershop in Lagos! The vibe is amazing and my fade is absolutely perfect. Will definitely be back! ✨", color: "cyan-500" },
              { name: "Sam O.", rating: 5, text: "I was nervous about trying something bold, but they made me feel so comfortable. Love my new style! 💫", color: "emerald-500" }
            ].map((testimonial, index) => (
              <div key={testimonial.name} className={`bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:rotate-1 border-2 border-transparent hover:border-gray-200 overflow-hidden group cursor-pointer`}>
                <div className={`absolute inset-0 bg-${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative z-10 text-center">
                  <div className={`w-20 h-20 bg-${testimonial.color} rounded-full flex items-center justify-center text-3xl mb-6 mx-auto shadow-xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500`}>
                    😍
                  </div>
                  <div className="flex justify-center mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-2xl hover:scale-125 transition-transform cursor-pointer">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-8 text-lg leading-relaxed italic font-medium">"{testimonial.text}"</p>
                <div className="text-center">
                  <p className={`font-black text-xl text-${testimonial.color}`}>— {testimonial.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Footer */}
      <footer className="bg-gray-900 py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-cyan-600 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className={`w-20 h-20 bg-${currentColor.primary} rounded-3xl flex items-center justify-center shadow-xl transform rotate-12 hover:rotate-45 transition-all duration-500 cursor-pointer`}>
                <span className="text-white text-3xl transform -rotate-12">✂️</span>
              </div>
              <div>
                <h4 className={`text-4xl font-black text-${currentColor.primary} transition-all duration-1000`}>VIBE CUTS</h4>
                <p className="text-gray-400 tracking-widest uppercase text-sm font-bold">Creative Studio</p>
              </div>
            </div>
            <p className="text-gray-300 text-xl font-medium">Where creativity meets craftsmanship ✨</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="bg-purple-600 p-8 rounded-3xl text-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">📍</div>
              <h4 className="text-2xl font-black mb-4">Find Us</h4>
              <p className="font-medium leading-relaxed">
                123 Creative Avenue<br />
                Victoria Island, Lagos<br />
                Nigeria
              </p>
            </div>
            
            <div className="bg-cyan-600 p-8 rounded-3xl text-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">🕐</div>
              <h4 className="text-2xl font-black mb-4">Open Hours</h4>
              <p className="font-medium leading-relaxed">
                Mon - Fri: 9AM - 8PM<br />
                Saturday: 8AM - 9PM<br />
                Sunday: 10AM - 6PM
              </p>
            </div>
            
            <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-xl transform hover:scale-105 hover:rotate-1 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4">💬</div>
              <h4 className="text-2xl font-black mb-4">Connect</h4>
              <p className="font-medium leading-relaxed">
                📱 +234 800 123 4567<br />
                ✉️ hello@vibecuts.ng<br />
                📸 @vibecuts
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-16 pt-10 text-center">
            <p className="text-gray-400 font-medium">© 2025 Vibe Cuts. Spreading good vibes, one cut at a time. 🌈</p>
          </div>
        </div>
      </footer>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-6000 {
          animation-delay: 6s;
        }
      `}</style>
    </div>
  );
}