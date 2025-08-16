'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PricingTable from "@/components/PricingTable";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { userType, isAuthenticated } = useAuth();

  // Redirect authenticated users to their appropriate portal
  useEffect(() => {
    if (isAuthenticated && userType) {
      if (userType === 'student') {
        window.location.href = '/portal/student';
      } else if (userType === 'instructor') {
        window.location.href = '/portal/instructor';
      } else if (userType === 'admin') {
        window.location.href = '/portal/admin';
      }
    }
  }, [isAuthenticated, userType]);

  return (
    <>
      <Navbar />
      <Hero />
      <PricingTable />
      <Footer />
    </>
  );
}
