import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Star, Users, Award, MapPin } from "lucide-react";

export default function HorsesPage() {
  const horses = [
    {
      id: 1,
      name: "Spirit",
      breed: "Arabian",
      age: "12 years",
      temperament: "Spirited",
      experience: "Intermediate",
      bio: "Beautiful Arabian with a gentle spirit and incredible endurance. Spirit loves trail riding and has a special connection with young riders. Her graceful movements and kind nature make her perfect for intermediate riders looking to advance their skills.",
      specialties: ["Trail Riding", "Dressage", "Youth Programs"],
      image: "🐎"
    },
    {
      id: 2,
      name: "Shadow",
      breed: "Quarter Horse",
      age: "15 years",
      temperament: "Calm",
      experience: "Beginner",
      bio: "Reliable Quarter Horse with a heart of gold. Shadow is our go-to horse for beginners and nervous riders. His steady temperament and patient nature help new riders build confidence quickly.",
      specialties: ["Beginner Lessons", "Trail Riding", "Therapeutic Riding"],
      image: "🐎"
    },
    {
      id: 3,
      name: "Thunder",
      breed: "Thoroughbred",
      age: "10 years",
      temperament: "Spirited",
      experience: "Advanced",
      bio: "Former racehorse with a heart of gold. Thunder has incredible athleticism and loves to jump. He's perfect for advanced riders who want to challenge themselves and experience the thrill of competitive riding.",
      specialties: ["Jumping", "Dressage", "Competition Training"],
      image: "🐎"
    },
    {
      id: 4,
      name: "Bella",
      breed: "Welsh Pony",
      age: "8 years",
      temperament: "Gentle",
      experience: "Youth",
      bio: "Sweet Welsh Pony who adores children. Bella is the perfect size for young riders and has a gentle, patient personality. She's a favorite in our youth programs and summer camps.",
      specialties: ["Youth Programs", "Summer Camps", "Pony Rides"],
      image: "🐎"
    },
    {
      id: 5,
      name: "Ranger",
      breed: "Appaloosa",
      age: "14 years",
      temperament: "Steady",
      experience: "All Levels",
      bio: "Versatile Appaloosa with a distinctive spotted coat. Ranger is comfortable with riders of all skill levels and excels in both arena work and trail riding. His steady nature makes him a great choice for group lessons.",
      specialties: ["All Skill Levels", "Trail Riding", "Group Lessons"],
      image: "🐎"
    },
    {
      id: 6,
      name: "Luna",
      breed: "Friesian",
      age: "11 years",
      temperament: "Elegant",
      experience: "Intermediate",
      bio: "Magnificent Friesian with flowing mane and tail. Luna's elegant movements and gentle disposition make her perfect for dressage and photo sessions. She has a special way of making every rider feel like royalty.",
      specialties: ["Dressage", "Photo Sessions", "Special Events"],
      image: "🐎"
    }
  ];

  const getTemperamentColor = (temperament: string) => {
    switch (temperament.toLowerCase()) {
      case 'calm':
      case 'gentle':
        return 'bg-sage-500';
      case 'spirited':
        return 'bg-copper-500';
      case 'steady':
        return 'bg-barn-600';
      default:
        return 'bg-sage-500';
    }
  };

  const getExperienceColor = (experience: string) => {
    switch (experience.toLowerCase()) {
      case 'beginner':
        return 'bg-sage-500';
      case 'intermediate':
        return 'bg-copper-500';
      case 'advanced':
        return 'bg-barn-600';
      case 'youth':
        return 'bg-butter-500 text-barn-900';
      case 'all levels':
        return 'bg-sage-500';
      default:
        return 'bg-sage-500';
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-butter-200 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-barn-900 rounded-full translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-copper-600 rounded-full -translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-barn-900 leading-tight mb-6">
              Meet Our Horses
            </h1>
            <p className="text-xl md:text-2xl text-barn-700 max-w-3xl mx-auto">
              Each horse has a unique personality and story. Find your perfect riding partner.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
                Our Equine Family
              </h2>
              <p className="text-lg text-barn-700 mb-6">
                Our horses are more than just riding partners—they're beloved members of our family. Each horse is carefully selected for their temperament, training, and ability to work with riders of different skill levels.
              </p>
              <p className="text-lg text-barn-700 mb-6">
                We maintain the highest standards of horse care, ensuring each animal receives proper nutrition, veterinary care, and plenty of love and attention. Our horses enjoy spacious pastures, comfortable stalls, and regular exercise.
              </p>
              <div className="flex items-center gap-2 text-copper-600 font-semibold">
                <Heart className="w-5 h-5" />
                <span>Loved, cared for, and ready to ride</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl shadow-soft overflow-hidden bg-white p-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 rounded-xl flex items-center justify-center">
                  <div className="text-center text-butter-300">
                    <div className="text-6xl mb-4">🏇</div>
                    <p className="text-lg font-semibold">Our Barn</p>
                    <p className="text-sm opacity-80">Professional photos coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Horses Grid */}
      <section className="py-16 md:py-24 bg-butter-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Available for Lessons
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Browse our horses and find the perfect match for your riding goals and experience level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {horses.map((horse) => (
              <div key={horse.id} className="card group hover:shadow-lg transition-shadow">
                {/* Horse Image */}
                <div className="relative mb-6">
                  <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 rounded-xl flex items-center justify-center overflow-hidden">
                    <div className="text-6xl group-hover:scale-110 transition-transform">
                      {horse.image}
                    </div>
                  </div>
                  
                  {/* Experience Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getExperienceColor(horse.experience)}`}>
                      {horse.experience}
                    </span>
                  </div>
                </div>

                {/* Horse Info */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-barn-900 mb-1">{horse.name}</h3>
                    <p className="text-copper-600 font-medium">{horse.breed}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-barn-600">
                    <span>{horse.age}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getTemperamentColor(horse.temperament)}`}>
                      {horse.temperament}
                    </span>
                  </div>

                  <p className="text-barn-700 text-sm leading-relaxed">
                    {horse.bio}
                  </p>

                  {/* Specialties */}
                  <div>
                    <h4 className="text-sm font-semibold text-barn-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {horse.specialties.map((specialty, index) => (
                        <span key={index} className="px-2 py-1 bg-butter-200 text-barn-700 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-outline w-full mt-4">
                    Book a Lesson with {horse.name}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horse Care Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Exceptional Horse Care
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              We believe that happy, healthy horses make the best riding partners. That's why we maintain the highest standards of equine care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-barn-900 mb-2">Quality Feed</h3>
              <p className="text-barn-700 text-sm">
                Premium hay, grain, and supplements tailored to each horse's needs
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-copper-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-barn-900 mb-2">Veterinary Care</h3>
              <p className="text-barn-700 text-sm">
                Regular check-ups, vaccinations, and prompt medical attention when needed
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-barn-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-barn-900 mb-2">Daily Exercise</h3>
              <p className="text-barn-700 text-sm">
                Regular turnout, training, and exercise to keep horses healthy and happy
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-barn-900 mb-2">Comfortable Living</h3>
              <p className="text-barn-700 text-sm">
                Spacious stalls, clean bedding, and access to fresh water and pasture
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-barn-900 text-butter-300 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Meet Your Perfect Horse?
          </h2>
          <p className="text-xl text-butter-300/80 mb-8 max-w-2xl mx-auto">
            Schedule a visit to meet our horses in person and find your ideal riding partner.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary text-lg px-8 py-4">
              Schedule a Visit
            </button>
            <button className="btn btn-secondary text-lg px-8 py-4">
              Book a Lesson
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
