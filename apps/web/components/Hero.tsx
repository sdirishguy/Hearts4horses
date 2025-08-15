import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-butter-200 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-barn-900 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-copper-600 rounded-full translate-x-48 translate-y-48"></div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Content */}
          <div className="fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-barn-900 leading-tight">
              Riding lessons, camps, and coaching—made simple.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-barn-700 max-w-2xl">
              Friendly, safe, and skill‑building equestrian training for kids and adults. 
              Experience the joy of horseback riding in a beautiful, supportive environment.
            </p>
            
            {/* Features */}
            <div className="mt-8 flex flex-wrap gap-4 text-sm text-barn-700">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span>Experienced Instructors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span>Safe Environment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-sage-500 rounded-full"></div>
                <span>All Skill Levels</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-wrap gap-4">
              <div className="hover:scale-105 transition-transform">
                <Link href="/services" className="btn btn-primary text-lg px-8 py-4">
                  View Pricing & Packages
                </Link>
              </div>
              <div className="hover:scale-105 transition-transform">
                <Link href="/portal/student/book" className="btn btn-secondary text-lg px-8 py-4">
                  Book a Lesson
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex items-center gap-8 text-sm text-barn-600">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-barn-900 rounded-full flex items-center justify-center">
                  <span className="text-butter-300 text-xs">✓</span>
                </div>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-barn-900 rounded-full flex items-center justify-center">
                  <span className="text-butter-300 text-xs">✓</span>
                </div>
                <span>Certified Instructors</span>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative slide-up">
            <div className="rounded-2xl shadow-soft overflow-hidden bg-white p-4">
              <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 rounded-xl flex items-center justify-center">
                <div className="text-center text-butter-300">
                  <div className="text-6xl mb-4">🐎</div>
                  <p className="text-lg font-semibold">Beautiful Barn & Horses</p>
                  <p className="text-sm opacity-80">Professional photos coming soon</p>
                </div>
              </div>
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -top-4 -left-4 bg-white rounded-xl p-4 shadow-soft">
              <div className="text-center">
                <div className="text-2xl font-bold text-barn-900">50+</div>
                <div className="text-xs text-barn-600">Happy Students</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl p-4 shadow-soft">
              <div className="text-center">
                <div className="text-2xl font-bold text-barn-900">10+</div>
                <div className="text-xs text-barn-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
