'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PricingTable from "@/components/PricingTable";
import Footer from "@/components/Footer";

export default function HomePage() {
  const { userType, isAuthenticated } = useAuth();

  // Redirect authenticated users to the unified portal
  useEffect(() => {
    if (isAuthenticated && userType) {
      window.location.href = '/portal/user';
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
