import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Camera, Video, Heart, Star, Users, Award } from "lucide-react";

export default function GalleryPage() {
  const galleryItems = [
    {
      id: 1,
      title: "Sunset Trail Ride",
      category: "Trail Riding",
      description: "Beautiful evening trail ride through our scenic property",
      type: "photo",
      featured: true
    },
    {
      id: 2,
      title: "Youth Summer Camp",
      category: "Summer Camps",
      description: "Young riders learning horse care and riding skills",
      type: "photo",
      featured: false
    },
    {
      id: 3,
      title: "Dressage Training",
      category: "Training",
      description: "Advanced dressage training session with Luna",
      type: "video",
      featured: true
    },
    {
      id: 4,
      title: "Beginner Lesson",
      category: "Lessons",
      description: "First-time rider building confidence with Shadow",
      type: "photo",
      featured: false
    },
    {
      id: 5,
      title: "Horse Care Workshop",
      category: "Education",
      description: "Students learning proper grooming techniques",
      type: "photo",
      featured: false
    },
    {
      id: 6,
      title: "Jumping Practice",
      category: "Training",
      description: "Thunder showing off his jumping skills",
      type: "video",
      featured: true
    },
    {
      id: 7,
      title: "Barn Tour",
      category: "Facility",
      description: "Our beautiful barn and stables",
      type: "photo",
      featured: false
    },
    {
      id: 8,
      title: "Group Lesson",
      category: "Lessons",
      description: "Friends learning together in a group setting",
      type: "photo",
      featured: false
    },
    {
      id: 9,
      title: "Special Event",
      category: "Events",
      description: "Birthday party celebration with pony rides",
      type: "photo",
      featured: false
    }
  ];

  const categories = ["All", "Lessons", "Training", "Trail Riding", "Summer Camps", "Events", "Facility", "Education"];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-butter-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-barn-900 rounded-full -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-copper-600 rounded-full translate-x-48 translate-y-48"></div>
        </div>
        
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-barn-900 leading-tight mb-6">
              Photo Gallery
            </h1>
            <p className="text-xl md:text-2xl text-barn-700 max-w-3xl mx-auto">
              Capture the magic of horseback riding through our lens.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Introduction */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
                Moments That Matter
              </h2>
              <p className="text-lg text-barn-700 mb-6">
                Our gallery showcases the joy, learning, and beautiful moments that happen every day at Hearts4Horses Equestrian Center. From first-time riders to advanced training, each photo tells a story of growth and connection.
              </p>
              <p className="text-lg text-barn-700 mb-6">
                We believe in capturing not just the riding, but the relationships, the learning, and the pure joy that comes from working with these magnificent animals.
              </p>
              <div className="flex items-center gap-2 text-copper-600 font-semibold">
                <Camera className="w-5 h-5" />
                <span>Every picture tells a story</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl shadow-soft overflow-hidden bg-white p-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 rounded-xl flex items-center justify-center">
                  <div className="text-center text-butter-300">
                    <div className="text-6xl mb-4">📸</div>
                    <p className="text-lg font-semibold">Professional Photos</p>
                    <p className="text-sm opacity-80">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-butter-100 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full bg-white text-barn-700 hover:bg-copper-600 hover:text-white transition-colors border border-butter-300"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-xl shadow-soft">
                  {/* Placeholder Image */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 flex items-center justify-center relative">
                    <div className="text-center text-butter-300">
                      <div className="text-4xl mb-2">
                        {item.type === 'video' ? '🎥' : '📸'}
                      </div>
                      <p className="text-sm font-medium">{item.title}</p>
                    </div>
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.type === 'video' ? (
                          <Video className="w-12 h-12 text-white" />
                        ) : (
                          <Camera className="w-12 h-12 text-white" />
                        )}
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 text-barn-700 text-xs font-medium rounded-full">
                        {item.category}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-copper-600 text-white text-xs font-medium rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold text-barn-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-barn-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="bg-barn-900 text-butter-300 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Featured Moments
            </h2>
            <p className="text-xl text-butter-300/80 max-w-2xl mx-auto">
              Some of our most cherished memories and special moments captured on camera.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Featured Item 1 */}
            <div className="relative overflow-hidden rounded-xl">
              <div className="aspect-[16/9] bg-gradient-to-br from-copper-600 to-barn-800 flex items-center justify-center">
                <div className="text-center text-butter-300">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-lg font-semibold">Student Success Story</p>
                  <p className="text-sm opacity-80">From beginner to confident rider</p>
                </div>
              </div>
            </div>

            {/* Featured Item 2 */}
            <div className="relative overflow-hidden rounded-xl">
              <div className="aspect-[16/9] bg-gradient-to-br from-sage-600 to-barn-800 flex items-center justify-center">
                <div className="text-center text-butter-300">
                  <div className="text-6xl mb-4">🎉</div>
                  <p className="text-lg font-semibold">Summer Camp Highlights</p>
                  <p className="text-sm opacity-80">Fun and learning in the sun</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Video Gallery
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Watch our horses and riders in action. From training sessions to special events, our videos bring the experience to life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video Placeholder 1 */}
            <div className="relative overflow-hidden rounded-xl shadow-soft">
              <div className="aspect-[16/9] bg-gradient-to-br from-barn-900 to-copper-600 flex items-center justify-center">
                <div className="text-center text-butter-300">
                  <div className="text-4xl mb-2">🎥</div>
                  <p className="text-sm font-medium">Training Session</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Placeholder 2 */}
            <div className="relative overflow-hidden rounded-xl shadow-soft">
              <div className="aspect-[16/9] bg-gradient-to-br from-barn-900 to-copper-600 flex items-center justify-center">
                <div className="text-center text-butter-300">
                  <div className="text-4xl mb-2">🎥</div>
                  <p className="text-sm font-medium">Trail Riding</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Video Placeholder 3 */}
            <div className="relative overflow-hidden rounded-xl shadow-soft">
              <div className="aspect-[16/9] bg-gradient-to-br from-barn-900 to-copper-600 flex items-center justify-center">
                <div className="text-center text-butter-300">
                  <div className="text-4xl mb-2">🎥</div>
                  <p className="text-sm font-medium">Facility Tour</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-butter-100 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
            Be Part of Our Story
          </h2>
          <p className="text-xl text-barn-700 mb-8 max-w-2xl mx-auto">
            Join us and create your own memories. Book a lesson today and become part of our growing family.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary text-lg px-8 py-4">
              Book a Lesson
            </button>
            <button className="btn btn-outline text-lg px-8 py-4">
              Schedule a Visit
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
