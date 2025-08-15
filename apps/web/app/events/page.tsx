import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Clock, MapPin, Users, Star, Award, Heart } from "lucide-react";

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Summer Riding Camp",
      date: "July 15-19, 2024",
      time: "9:00 AM - 3:00 PM",
      type: "Camp",
      price: "$350",
      spots: "12 spots available",
      description: "A week-long immersive camp for young riders aged 8-16. Includes daily riding lessons, horse care education, crafts, and outdoor activities.",
      features: ["Daily riding lessons", "Horse care workshops", "Arts & crafts", "Outdoor games", "Friday showcase"],
      featured: true
    },
    {
      id: 2,
      title: "Trail Riding Adventure",
      date: "August 3, 2024",
      time: "2:00 PM - 5:00 PM",
      type: "Trail Ride",
      price: "$75",
      spots: "8 spots available",
      description: "Join us for a scenic trail ride through our beautiful property. Perfect for riders of all skill levels who want to experience the joy of trail riding.",
      features: ["Guided trail ride", "Safety briefing", "Refreshments", "Photo opportunities"],
      featured: false
    },
    {
      id: 3,
      title: "Horse Care Workshop",
      date: "August 10, 2024",
      time: "10:00 AM - 12:00 PM",
      type: "Workshop",
      price: "$45",
      spots: "15 spots available",
      description: "Learn essential horse care skills including grooming, feeding, and basic health monitoring. Great for new horse owners and enthusiasts.",
      features: ["Hands-on grooming", "Feeding guidelines", "Health basics", "Safety training"],
      featured: false
    },
    {
      id: 4,
      title: "Fall Break Camp",
      date: "October 14-18, 2024",
      time: "9:00 AM - 3:00 PM",
      type: "Camp",
      price: "$350",
      spots: "15 spots available",
      description: "Keep your kids active and engaged during fall break with our fun-filled riding camp. Perfect for continuing their equestrian education.",
      features: ["Daily riding lessons", "Autumn crafts", "Horse care", "Team building", "Friday performance"],
      featured: false
    },
    {
      id: 5,
      title: "Holiday Pony Rides",
      date: "December 21, 2024",
      time: "10:00 AM - 2:00 PM",
      type: "Special Event",
      price: "$25",
      spots: "Unlimited",
      description: "A magical holiday event featuring pony rides, hot chocolate, and festive activities. Perfect for families and young children.",
      features: ["Pony rides", "Holiday crafts", "Hot chocolate", "Photo with Santa", "Festive decorations"],
      featured: true
    },
    {
      id: 6,
      title: "Adult Riding Clinic",
      date: "September 7, 2024",
      time: "1:00 PM - 4:00 PM",
      type: "Clinic",
      price: "$120",
      spots: "6 spots available",
      description: "Intensive riding clinic designed specifically for adult riders. Focus on technique, confidence building, and advanced skills.",
      features: ["Individual instruction", "Video analysis", "Technique focus", "Confidence building"],
      featured: false
    }
  ];

  const eventTypes = ["All", "Camp", "Trail Ride", "Workshop", "Special Event", "Clinic"];

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
              Events & Activities
            </h1>
            <p className="text-xl md:text-2xl text-barn-700 max-w-3xl mx-auto">
              Join us for exciting events, camps, and special activities throughout the year.
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
                Something for Everyone
              </h2>
              <p className="text-lg text-barn-700 mb-6">
                From summer camps for kids to specialized clinics for adults, we offer a variety of events designed to enhance your equestrian experience. Our events combine education, fun, and the joy of working with horses.
              </p>
              <p className="text-lg text-barn-700 mb-6">
                Whether you're a complete beginner or an experienced rider, our events provide opportunities to learn, grow, and create lasting memories with our equine friends.
              </p>
              <div className="flex items-center gap-2 text-copper-600 font-semibold">
                <Calendar className="w-5 h-5" />
                <span>Check back regularly for new events</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl shadow-soft overflow-hidden bg-white p-4">
                <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 rounded-xl flex items-center justify-center">
                  <div className="text-center text-butter-300">
                    <div className="text-6xl mb-4">🎉</div>
                    <p className="text-lg font-semibold">Special Events</p>
                    <p className="text-sm opacity-80">Professional photos coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types Filter */}
      <section className="bg-butter-100 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            {eventTypes.map((type) => (
              <button
                key={type}
                className="px-6 py-2 rounded-full bg-white text-barn-700 hover:bg-copper-600 hover:text-white transition-colors border border-butter-300"
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Featured Events
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Don't miss these special events and popular camps. Book early as spots fill up quickly!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {upcomingEvents.filter(event => event.featured).map((event) => (
              <div key={event.id} className="card relative">
                {event.featured && (
                  <div className="absolute -top-3 left-4">
                    <div className="bg-copper-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Featured Event
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-2 text-sm text-barn-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                    <span>•</span>
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-barn-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-barn-600 mb-4">
                    <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full">{event.type}</span>
                    <span className="font-semibold text-copper-600">{event.price}</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {event.spots}
                    </span>
                  </div>
                  <p className="text-barn-700 mb-4">{event.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-barn-900 mb-2">What's Included:</h4>
                    <ul className="space-y-1">
                      {event.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-barn-700">
                          <div className="w-1.5 h-1.5 bg-sage-500 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button className="btn btn-primary w-full">Register Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Events */}
      <section className="py-16 md:py-24 bg-butter-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              All Upcoming Events
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Browse all our upcoming events and find the perfect activity for you or your family.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card group hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-barn-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-barn-900 mb-2">{event.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-barn-600 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs">{event.type}</span>
                    <span className="font-semibold text-copper-600">{event.price}</span>
                  </div>
                  <p className="text-barn-700 text-sm mb-4">{event.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-barn-900 mb-2 text-sm">Highlights:</h4>
                    <div className="flex flex-wrap gap-1">
                      {event.features.slice(0, 3).map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-butter-200 text-barn-700 text-xs rounded-full">
                          {feature}
                        </span>
                      ))}
                      {event.features.length > 3 && (
                        <span className="px-2 py-1 bg-butter-200 text-barn-700 text-xs rounded-full">
                          +{event.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-barn-600 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {event.spots}
                  </span>
                  <button className="btn btn-outline text-sm">Register</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Categories */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Types of Events
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              We offer a variety of events to suit different interests and skill levels.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Summer Camps</h3>
              <p className="text-barn-700 mb-4">
                Week-long immersive camps for kids and teens. Perfect for building skills and making friends.
              </p>
              <ul className="text-sm text-barn-700 space-y-1">
                <li>• Daily riding lessons</li>
                <li>• Horse care education</li>
                <li>• Fun activities and crafts</li>
                <li>• Friday showcase for parents</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-copper-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Trail Rides</h3>
              <p className="text-barn-700 mb-4">
                Scenic guided trail rides through our beautiful property. Suitable for all skill levels.
              </p>
              <ul className="text-sm text-barn-700 space-y-1">
                <li>• Guided tours</li>
                <li>• Safety briefing</li>
                <li>• Beautiful scenery</li>
                <li>• Photo opportunities</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-barn-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Workshops</h3>
              <p className="text-barn-700 mb-4">
                Educational workshops focused on horse care, riding techniques, and equestrian knowledge.
              </p>
              <ul className="text-sm text-barn-700 space-y-1">
                <li>• Hands-on learning</li>
                <li>• Expert instruction</li>
                <li>• Small group sizes</li>
                <li>• Take-home materials</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Special Events</h3>
              <p className="text-barn-700 mb-4">
                Holiday celebrations, birthday parties, and unique experiences for special occasions.
              </p>
              <ul className="text-sm text-barn-700 space-y-1">
                <li>• Customized packages</li>
                <li>• Themed decorations</li>
                <li>• Professional staff</li>
                <li>• Memorable experiences</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-copper-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Adult Clinics</h3>
              <p className="text-barn-700 mb-4">
                Intensive training sessions designed specifically for adult riders of all skill levels.
              </p>
              <ul className="text-sm text-barn-700 space-y-1">
                <li>• Individual attention</li>
                <li>• Skill development</li>
                <li>• Confidence building</li>
                <li>• Advanced techniques</li>
              </ul>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-barn-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-barn-900 mb-3">Seasonal Camps</h3>
              <p className="text-barn-700 mb-4">
                Camps during school breaks including spring break, fall break, and winter holidays.
              </p>
              <ul className="text-sm text-barn-700 space-y-1">
                <li>• School break scheduling</li>
                <li>• Age-appropriate activities</li>
                <li>• Flexible registration</li>
                <li>• Extended care options</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-barn-900 text-butter-300 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join an Event?
          </h2>
          <p className="text-xl text-butter-300/80 mb-8 max-w-2xl mx-auto">
            Don't miss out on these exciting opportunities. Register early to secure your spot!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary text-lg px-8 py-4">
              View All Events
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
