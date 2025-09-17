
// import React, { useState, useEffect } from 'react';
// import { ChevronLeft, ChevronRight, Star, Scissors, Award, Users } from 'lucide-react';



// const ImageSlider = ({ images, title, autoPlay = true, interval = 3000 }) => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (autoPlay) {
//       const timer = setInterval(() => {
//         setCurrentIndex((prev) => (prev + 1) % images.length);
//       }, interval);
//       return () => clearInterval(timer);
//     }
//   }, [autoPlay, interval, images.length]);

//   const nextSlide = () => {
//     setCurrentIndex((prev) => (prev + 1) % images.length);
//   };

//   const prevSlide = () => {
//     setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
//   };

//   return (
//     <div className="relative group">
//       <div className="text-center mb-4">
//         <h3 className="text-xl font-bold text-white bg-black bg-opacity-60 px-4 py-2 rounded-full inline-block">
//           {title}
//         </h3>
//       </div>
      
//       <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl">
//         <div 
//           className="flex transition-transform duration-500 ease-in-out h-full"
//           style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//         >
//           {images.map((image, index) => (
//             <div key={index} className="min-w-full h-full relative">
//               <img 
//                 src={image.src} 
//                 alt={image.alt}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
//               <div className="absolute bottom-4 left-4 text-white">
//                 <p className="font-bold text-lg">{image.caption}</p>
//                 {image.description && (
//                   <p className="text-sm opacity-90">{image.description}</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
        
//         {/* Navigation Buttons */}
//         <button 
//           onClick={prevSlide}
//           className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//         >
//           <ChevronLeft className="w-6 h-6" />
//         </button>
//         <button 
//           onClick={nextSlide}
//           className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
//         >
//           <ChevronRight className="w-6 h-6" />
//         </button>
        
//         {/* Indicators */}
//         <div className="absolute bottom-4 right-4 flex space-x-2">
//           {images.map((_, index) => (
//             <button
//               key={index}
//               onClick={() => setCurrentIndex(index)}
//               className={`w-3 h-3 rounded-full transition-all duration-300 ${
//                 index === currentIndex 
//                   ? 'bg-white scale-125' 
//                   : 'bg-white bg-opacity-50 hover:bg-opacity-80'
//               }`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };


// export default ImageSlider;