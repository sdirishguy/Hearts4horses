import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, Award, Users, Heart } from "lucide-react";

export default function AboutPage() {
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
          About Hearts4Horses Equestrian Center
        </h1>
            <p className="text-xl md:text-2xl text-barn-700 max-w-3xl mx-auto">
              Where passion meets purpose, and every rider finds their perfect partner.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-barn-700 mb-6">
                At Hearts4Horses Equestrian Center, we believe that horseback riding is more than just a sport—it's a transformative experience that builds confidence, character, and connection. Our mission is to provide safe, professional, and inspiring equestrian education for riders of all ages and skill levels.
              </p>
              <p className="text-lg text-barn-700 mb-6">
                We're committed to fostering a love for horses while teaching proper horsemanship, riding skills, and the values of responsibility, patience, and respect for these magnificent animals.
              </p>
              <div className="flex items-center gap-2 text-copper-600 font-semibold">
                <Heart className="w-5 h-5" />
                <span>Building relationships that last a lifetime</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl shadow-soft overflow-hidden bg-white p-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 rounded-xl flex items-center justify-center">
                  <div className="text-center text-butter-300">
                    <div className="text-6xl mb-4">🏆</div>
                    <p className="text-lg font-semibold">Our Facility</p>
                    <p className="text-sm opacity-80">Professional photos coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-barn-900 text-butter-300 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-copper-400 mb-2">10+</div>
              <div className="text-butter-300/80">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-copper-400 mb-2">50+</div>
              <div className="text-butter-300/80">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-copper-400 mb-2">15</div>
              <div className="text-butter-300/80">Beautiful Horses</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-copper-400 mb-2">100%</div>
              <div className="text-butter-300/80">Safety Record</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Our certified instructors and dedicated staff are passionate about sharing their love of horses and helping every student reach their full potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Instructor 1 */}
            <div className="card text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-barn-900 to-copper-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="text-butter-300 text-4xl">👩‍🏫</div>
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-2">Sarah Johnson</h3>
              <p className="text-copper-600 font-medium mb-4">Head Instructor</p>
              <p className="text-barn-700">
                Certified riding instructor with 15+ years of experience. Specializes in dressage and jumping.
              </p>
            </div>

            {/* Instructor 2 */}
            <div className="card text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-barn-900 to-copper-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="text-butter-300 text-4xl">👨‍🏫</div>
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-2">Mike Rodriguez</h3>
              <p className="text-copper-600 font-medium mb-4">Trail Riding Specialist</p>
              <p className="text-barn-700">
                Expert in trail riding and horse care. Loves introducing beginners to the joy of horseback riding.
              </p>
            </div>

            {/* Instructor 3 */}
            <div className="card text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-barn-900 to-copper-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="text-butter-300 text-4xl">👩‍🏫</div>
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-2">Emily Chen</h3>
              <p className="text-copper-600 font-medium mb-4">Youth Program Director</p>
              <p className="text-barn-700">
                Dedicated to creating magical experiences for young riders. Leads our popular summer camps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-butter-100 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Our Values
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              These core principles guide everything we do at Hearts4Horses Equestrian Center.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Excellence</h3>
              <p className="text-barn-700">
                We maintain the highest standards in instruction, horse care, and facility maintenance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Compassion</h3>
              <p className="text-barn-700">
                We treat every horse and rider with kindness, patience, and understanding.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Community</h3>
              <p className="text-barn-700">
                We foster a supportive environment where riders of all levels can learn and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
                Visit Our Facility
              </h2>
              <p className="text-lg text-barn-700 mb-8">
                Come experience the magic of Hearts4Horses Equestrian Center for yourself. We'd love to show you around our beautiful facility and introduce you to our amazing horses.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-copper-600" />
                  <span className="text-barn-700">[Address coming soon]</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-copper-600" />
                  <span className="text-barn-700">[Phone coming soon]</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-copper-600" />
                  <span className="text-barn-700">info@hearts4horses.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-copper-600" />
                  <span className="text-barn-700">Open 7 days a week, 8 AM - 6 PM</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl shadow-soft overflow-hidden bg-white p-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 rounded-xl flex items-center justify-center">
                  <div className="text-center text-butter-300">
                    <div className="text-6xl mb-4">🗺️</div>
                    <p className="text-lg font-semibold">Location Map</p>
                    <p className="text-sm opacity-80">Interactive map coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
