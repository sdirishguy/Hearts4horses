import Link from "next/link";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-barn-900 text-butter-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-butter-300 rounded-full flex items-center justify-center">
                <span className="text-barn-900 font-bold text-lg">H4H</span>
              </div>
              <div className="text-butter-300 font-bold text-xl">Hearts4Horses</div>
            </div>
            <p className="text-butter-300/80 mb-6 max-w-md">
              Professional equestrian training and riding lessons for all ages and skill levels. 
              Experience the joy of horseback riding in a safe, supportive environment.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/hearts4horses_214/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-butter-300/10 rounded-full flex items-center justify-center hover:bg-butter-300/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/hearts4horses214/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-butter-300/10 rounded-full flex items-center justify-center hover:bg-butter-300/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-butter-300/80 hover:text-butter-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-butter-300/80 hover:text-butter-300 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/horses" className="text-butter-300/80 hover:text-butter-300 transition-colors">
                  Our Horses
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-butter-300/80 hover:text-butter-300 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-butter-300/80 hover:text-butter-300 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-butter-300/80 hover:text-butter-300 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-copper-600" />
                <span className="text-butter-300/80">
                  [Address coming soon]
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-copper-600" />
                <span className="text-butter-300/80">
                  [Phone coming soon]
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-copper-600" />
                <span className="text-butter-300/80">
                  info@hearts4horses.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-butter-300/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-butter-300/60 text-sm">
            © 2024 Hearts4Horses. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-butter-300/60 hover:text-butter-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-butter-300/60 hover:text-butter-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
