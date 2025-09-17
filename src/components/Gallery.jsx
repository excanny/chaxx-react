import React from "react";

const styles = [
  {
    title: "Fresh Fade",
    image:
      "https://images.unsplash.com/photo-1610173826011-94690e18dfe9?q=80&w=800",
  },
  {
    title: "Curly Top",
    image:
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381c?q=80&w=800",
  },
  {
    title: "Classic Waves",
    image:
      "https://images.unsplash.com/photo-1613601642776-8dce7c2a27cd?q=80&w=800",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-16 bg-gray-50 text-gray-900">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-yellow-600">
          ✨ Latest Haircuts
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Get inspired — or just book directly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {styles.map((style) => (
            <div
              key={style.title}
              className="group relative rounded-2xl overflow-hidden shadow hover:shadow-xl transition"
            >
              <img
                src={style.image}
                alt={style.title}
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-lg font-semibold text-yellow-400">
                  {style.title}
                </h3>
                <button className="mt-2 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-400 transition">
                  Book This Style
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
