import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
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
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-barn-700 max-w-3xl mx-auto">
              Get in touch with us. We'd love to hear from you and answer any questions you may have.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
                Send Us a Message
              </h2>
              <p className="text-lg text-barn-700 mb-8">
                Have a question about our services? Want to schedule a visit? Fill out the form below and we'll get back to you as soon as possible.
              </p>

              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-barn-900 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      required
                      className="form-input w-full"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-barn-900 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      required
                      className="form-input w-full"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-barn-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="form-input w-full"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-barn-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input w-full"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-barn-900 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    className="form-input w-full"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="lessons">Lesson Information</option>
                    <option value="camps">Summer Camps</option>
                    <option value="events">Special Events</option>
                    <option value="pricing">Pricing & Packages</option>
                    <option value="visit">Schedule a Visit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-barn-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="form-input w-full"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    className="mt-1"
                  />
                  <label htmlFor="newsletter" className="text-sm text-barn-700">
                    Subscribe to our newsletter for updates on events, camps, and special offers.
                  </label>
                </div>

                <button type="submit" className="btn btn-primary w-full text-lg py-4">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-barn-700 mb-8">
                We're here to help! Reach out to us through any of the methods below, or stop by for a visit.
              </p>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-barn-900 mb-1">Visit Our Facility</h3>
                    <p className="text-barn-700">
                      [Address coming soon]<br />
                      [City, State ZIP]
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-copper-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-barn-900 mb-1">Call Us</h3>
                    <p className="text-barn-700">
                      [Phone coming soon]<br />
                      <span className="text-sm text-barn-600">Leave a message and we'll call you back</span>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-barn-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-barn-900 mb-1">Email Us</h3>
                    <p className="text-barn-700">
                      info@hearts4horses.com<br />
                      <span className="text-sm text-barn-600">We typically respond within 24 hours</span>
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-barn-900 mb-1">Business Hours</h3>
                    <div className="text-barn-700 space-y-1">
                      <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                      <p>Saturday: 8:00 AM - 5:00 PM</p>
                      <p>Sunday: 9:00 AM - 4:00 PM</p>
                      <p className="text-sm text-barn-600 mt-2">
                        *Hours may vary during holidays and special events
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <div className="rounded-xl shadow-soft overflow-hidden bg-white p-4">
                  <div className="aspect-[4/3] bg-gradient-to-br from-barn-900 to-copper-600 rounded-xl flex items-center justify-center">
                    <div className="text-center text-butter-300">
                      <div className="text-6xl mb-4">🗺️</div>
                      <p className="text-lg font-semibold">Interactive Map</p>
                      <p className="text-sm opacity-80">Coming soon</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-butter-100">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-barn-700 max-w-2xl mx-auto">
              Find quick answers to common questions about our services and policies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-barn-900 mb-2">What should I wear for my first lesson?</h3>
                <p className="text-barn-700 text-sm">
                  Wear comfortable, close-fitting clothes and closed-toe shoes with a small heel. We provide helmets and safety equipment.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-barn-900 mb-2">Do I need to bring my own horse?</h3>
                <p className="text-barn-700 text-sm">
                  No! We provide well-trained horses suitable for all skill levels. Our horses are carefully selected and maintained for safety and comfort.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-barn-900 mb-2">What age can children start riding?</h3>
                <p className="text-barn-700 text-sm">
                  We accept children as young as 6 years old for pony rides and 8 years old for regular lessons. Each child is evaluated individually.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-barn-900 mb-2">How do I cancel or reschedule a lesson?</h3>
                <p className="text-barn-700 text-sm">
                  Please contact us at least 24 hours in advance to cancel or reschedule. Late cancellations may be subject to a fee.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-barn-900 mb-2">What's included in the lesson price?</h3>
                <p className="text-barn-700 text-sm">
                  All lessons include horse rental, safety equipment, and instruction. Group lessons also include shared arena time.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-barn-900 mb-2">Can I watch my child's lesson?</h3>
                <p className="text-barn-700 text-sm">
                  Absolutely! We have comfortable viewing areas where parents can watch lessons. We encourage family involvement.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-barn-900 mb-2">Do you offer gift certificates?</h3>
                <p className="text-barn-700 text-sm">
                  Yes! Gift certificates are available for any amount and can be used for lessons, camps, or special events.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-barn-900 mb-2">What if it rains on the day of my lesson?</h3>
                <p className="text-barn-700 text-sm">
                  We have an indoor arena, so lessons continue rain or shine. In case of severe weather, we'll contact you to reschedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="bg-barn-900 text-butter-300 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Emergency Contact
              </h2>
              <p className="text-xl text-butter-300/80">
                For urgent matters outside of business hours
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-copper-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Emergency Line</h3>
                <p className="text-butter-300/80">
                  [Emergency phone coming soon]<br />
                  <span className="text-sm">Available 24/7 for urgent matters</span>
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-sage-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Text Message</h3>
                <p className="text-butter-300/80">
                  [Text number coming soon]<br />
                  <span className="text-sm">For non-urgent after-hours questions</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-butter-100 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-barn-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-barn-700 mb-8 max-w-2xl mx-auto">
            Contact us today to schedule your first lesson or learn more about our programs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary text-lg px-8 py-4">
              Book Your First Lesson
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
