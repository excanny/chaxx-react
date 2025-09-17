import SectionHeader from "./SectionHeader";
import GalleryItem from "./GalleryItem";

const GallerySection = () => {
  const galleryItems = [
    { image: "assets/images/gallery1.jpg", title: "Bold Fade", color: "purple-500" },
    { image: "assets/images/gallery2.jpg", title: "Textured Waves", color: "cyan-500" },
    { image: "assets/images/gallery3.jpg", title: "Classic Modern", color: "emerald-500" },
    { image: "assets/images/gallery4.jpg", title: "Creative Cut", color: "orange-500" },
    { image: "assets/images/gallery5.jpg", title: "Beard Artistry", color: "yellow-500" },
    { image: "assets/images/gallery6.jpg", title: "Full Transform", color: "pink-500" }
  ];

  return (
    <section id="gallery" className="py-5 bg-purple-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeader 
          badge="📸 Style Showcase"
          title="Creative Gallery"
          subtitle="Check out some of our most vibrant transformations! 🌟"
          badgeColor="cyan-600"
          titleColor="cyan-600"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {galleryItems.map((item, index) => (
            <GalleryItem key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};


export default GallerySection;