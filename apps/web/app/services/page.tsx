import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingTable from "@/components/PricingTable";
import { Check, Star, Clock, Users, Award, Calendar, Heart } from "lucide-react";

export default function ServicesPage() {
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
              Our Services
            </h1>
            <p className="text-xl md:text-2xl text-barn-700 max-w-3xl mx-auto">
              From beginner lessons to advanced training, we offer a complete range of equestrian services.
            </p>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              What We Offer
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Whether you're taking your first ride or preparing for competition, we have the perfect program for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Private Lessons */}
            <div className="card">
              <div className="w-16 h-16 bg-sage-500 rounded-full mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Private Lessons</h3>
              <p className="text-barn-700 mb-4">
                One-on-one instruction tailored to your skill level and goals. Perfect for focused learning and rapid progress.
              </p>
              <ul className="space-y-2 text-sm text-barn-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Personalized instruction
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Flexible scheduling
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Progress tracking
                </li>
              </ul>
            </div>

            {/* Group Lessons */}
            <div className="card">
              <div className="w-16 h-16 bg-copper-500 rounded-full mb-6 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Group Lessons</h3>
              <p className="text-barn-700 mb-4">
                Learn alongside peers in a fun, social environment. Great for building confidence and making friends.
              </p>
              <ul className="space-y-2 text-sm text-barn-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Social learning environment
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Cost-effective option
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Skill-appropriate groups
                </li>
              </ul>
            </div>

            {/* Summer Camps */}
            <div className="card">
              <div className="w-16 h-16 bg-barn-600 rounded-full mb-6 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Summer Camps</h3>
              <p className="text-barn-700 mb-4">
                Immersive day camps combining riding instruction with horse care, crafts, and outdoor activities.
              </p>
              <ul className="space-y-2 text-sm text-barn-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Full-day programs
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Horse care education
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Fun activities included
                </li>
              </ul>
            </div>

            {/* Trail Riding */}
            <div className="card">
              <div className="w-16 h-16 bg-sage-500 rounded-full mb-6 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Trail Riding</h3>
              <p className="text-barn-700 mb-4">
                Explore beautiful trails with our experienced guides. Perfect for nature lovers and adventure seekers.
              </p>
              <ul className="space-y-2 text-sm text-barn-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Scenic trail routes
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Guided tours available
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  All skill levels welcome
                </li>
              </ul>
            </div>

            {/* Horse Care Classes */}
            <div className="card">
              <div className="w-16 h-16 bg-copper-500 rounded-full mb-6 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Horse Care Classes</h3>
              <p className="text-barn-700 mb-4">
                Learn essential horse care skills including grooming, feeding, and basic veterinary care.
              </p>
              <ul className="space-y-2 text-sm text-barn-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Hands-on learning
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Safety training
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Certification available
                </li>
              </ul>
            </div>

            {/* Special Events */}
            <div className="card">
              <div className="w-16 h-16 bg-barn-600 rounded-full mb-6 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Special Events</h3>
              <p className="text-barn-700 mb-4">
                Birthday parties, corporate events, and special occasions. Create unforgettable memories with horses.
              </p>
              <ul className="space-y-2 text-sm text-barn-700">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Customized packages
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  All ages welcome
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-sage-500" />
                  Professional staff
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-butter-100 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Pricing & Packages
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. Choose the option that best fits your needs and budget.
            </p>
          </div>
          
          <PricingTable />
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Lesson Packages
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Save money and commit to your riding journey with our discounted lesson packages.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Package */}
            <div className="card text-center relative">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-barn-900 mb-2">Starter Package</h3>
                <div className="text-3xl font-bold text-barn-900 mb-1">$200</div>
                <div className="text-sm text-barn-600 mb-6">5 lessons</div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">5 private or group lessons</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Valid for 3 months</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Safety equipment included</span>
                </div>
              </div>

              <button className="btn btn-outline w-full">Choose Package</button>
            </div>

            {/* Popular Package */}
            <div className="card text-center relative ring-2 ring-copper-600 scale-105">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-copper-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-xl font-semibold text-barn-900 mb-2">Rider Package</h3>
                <div className="text-3xl font-bold text-barn-900 mb-1">$350</div>
                <div className="text-sm text-barn-600 mb-6">10 lessons</div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">10 private or group lessons</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Valid for 6 months</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Progress tracking included</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Free trail ride</span>
                </div>
              </div>

              <button className="btn btn-primary w-full">Choose Package</button>
            </div>

            {/* Premium Package */}
            <div className="card text-center relative">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-barn-900 mb-2">Premium Package</h3>
                <div className="text-3xl font-bold text-barn-900 mb-1">$600</div>
                <div className="text-sm text-barn-600 mb-6">20 lessons</div>
              </div>

              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">20 private or group lessons</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Valid for 12 months</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Priority booking</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">2 free trail rides</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-sage-500 flex-shrink-0" />
                  <span className="text-barn-700">Horse care workshop</span>
                </div>
              </div>

              <button className="btn btn-outline w-full">Choose Package</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-barn-900 text-butter-300 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Your Riding Journey?
          </h2>
          <p className="text-xl text-butter-300/80 mb-8 max-w-2xl mx-auto">
            Book your first lesson today and experience the joy of horseback riding in a safe, supportive environment.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary text-lg px-8 py-4">
              Book Your First Lesson
            </button>
            <button className="btn btn-secondary text-lg px-8 py-4">
              Contact Us
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
