"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, User, Settings } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-butter-300">
      <nav className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-barn-900 rounded-full flex items-center justify-center">
              <span className="text-butter-300 font-bold text-lg">H4H</span>
            </div>
            <div className="text-barn-900 font-bold text-xl">Hearts4Horses</div>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-6">
            <li>
              <Link href="/about" className="text-barn-700 hover:text-barn-900 transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/services" className="text-barn-700 hover:text-barn-900 transition-colors">
                Services
              </Link>
            </li>
            <li>
              <Link href="/horses" className="text-barn-700 hover:text-barn-900 transition-colors">
                Horses
              </Link>
            </li>
            <li>
              <Link href="/gallery" className="text-barn-700 hover:text-barn-900 transition-colors">
                Gallery
              </Link>
            </li>
            <li>
              <Link href="/events" className="text-barn-700 hover:text-barn-900 transition-colors">
                Events
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-barn-700 hover:text-barn-900 transition-colors">
                Contact
              </Link>
            </li>
          </ul>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/portal/student" className="btn btn-primary">
              Student Portal
            </Link>
            <Link href="/portal/admin" className="btn btn-outline">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-butter-300">
            <ul className="flex flex-col gap-4 mt-4">
              <li>
                <Link 
                  href="/about" 
                  className="block text-barn-700 hover:text-barn-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/services" 
                  className="block text-barn-700 hover:text-barn-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  href="/horses" 
                  className="block text-barn-700 hover:text-barn-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Horses
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery" 
                  className="block text-barn-700 hover:text-barn-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  href="/events" 
                  className="block text-barn-700 hover:text-barn-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="block text-barn-700 hover:text-barn-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
            <div className="flex flex-col gap-3 mt-6">
              <Link 
                href="/portal/student" 
                className="btn btn-primary text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Student Portal
              </Link>
              <Link 
                href="/portal/admin" 
                className="btn btn-outline text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
