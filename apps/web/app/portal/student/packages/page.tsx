'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { studentAPI } from '@/lib/auth';
import { Package, Clock, Calendar, ArrowLeft, Plus, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface StudentPackage {
  id: string;
  name: string;
  description: string;
  totalLessons: number;
  usedLessons: number;
  remainingLessons: number;
  price: number;
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
}

interface AvailablePackage {
  id: string;
  name: string;
  description: string;
  totalLessons: number;
  price: number;
  duration: number; // in days
  isPopular?: boolean;
}

export default function PackagesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [studentPackages, setStudentPackages] = useState<StudentPackage[]>([]);
  const [availablePackages, setAvailablePackages] = useState<AvailablePackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(false);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<AvailablePackage | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStudentPackages();
      loadAvailablePackages();
    }
  }, [isAuthenticated]);

  const loadStudentPackages = async () => {
    try {
      setIsLoadingPackages(true);
      const response = await studentAPI.getPackages();
      setStudentPackages(response.data);
    } catch (error) {
      console.error('Error loading student packages:', error);
    } finally {
      setIsLoadingPackages(false);
    }
  };

  const loadAvailablePackages = async () => {
    try {
      setIsLoadingAvailable(true);
      const response = await studentAPI.getAvailablePackages();
      setAvailablePackages(response.data);
    } catch (error) {
      console.error('Error loading available packages:', error);
    } finally {
      setIsLoadingAvailable(false);
    }
  };

  const handlePurchasePackage = async (pkg: AvailablePackage) => {
    try {
      setIsPurchasing(true);
      await studentAPI.purchasePackage({
        packageId: pkg.id,
        paymentSource: 'credit_card' // or 'stripe'
      });
      
      // Refresh packages after purchase
      await loadStudentPackages();
      setSelectedPackage(null);
      
      alert('Package purchased successfully!');
    } catch (error: any) {
      console.error('Error purchasing package:', error);
      alert(error.response?.data?.error || 'Failed to purchase package. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (expiryDate: string) => {
    const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
    if (daysUntilExpiry < 0) return 'expired';
    if (daysUntilExpiry <= 7) return 'expiring-soon';
    return 'active';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-butter-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper-600 mx-auto mb-4"></div>
          <p className="text-barn-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-butter-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-butter-300">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/portal/student" className="flex items-center gap-2 text-barn-600 hover:text-barn-900">
                <ArrowLeft className="w-4 h-4" />
                Back to Portal
              </Link>
              <div className="h-6 w-px bg-butter-300"></div>
              <h1 className="text-xl font-semibold text-barn-900">My Packages</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Current Packages */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <h2 className="text-lg font-semibold text-barn-900 mb-6">My Current Packages</h2>
          
          {isLoadingPackages ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper-600 mx-auto mb-4"></div>
              <p className="text-barn-700">Loading your packages...</p>
            </div>
          ) : studentPackages.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-barn-400 mx-auto mb-4" />
              <p className="text-barn-700">You don't have any packages yet.</p>
              <p className="text-sm text-barn-600 mt-2">Purchase a package below to start booking lessons.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentPackages.map((pkg) => {
                const expiryStatus = getExpiryStatus(pkg.expiresAt);
                const daysUntilExpiry = getDaysUntilExpiry(pkg.expiresAt);
                
                return (
                  <div key={pkg.id} className="border border-butter-300 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-barn-900">{pkg.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expiryStatus === 'expired' ? 'bg-red-100 text-red-700' :
                        expiryStatus === 'expiring-soon' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {expiryStatus === 'expired' ? 'Expired' :
                         expiryStatus === 'expiring-soon' ? 'Expiring Soon' :
                         'Active'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-barn-700 mb-4">{pkg.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-barn-600">Lessons Used:</span>
                        <span className="font-medium text-barn-900">{pkg.usedLessons} / {pkg.totalLessons}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-barn-600">Remaining:</span>
                        <span className="font-medium text-barn-900">{pkg.remainingLessons}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-barn-600">Price:</span>
                        <span className="font-medium text-barn-900">${pkg.price}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-barn-600">Expires:</span>
                        <span className="font-medium text-barn-900">{formatDate(pkg.expiresAt)}</span>
                      </div>
                    </div>

                    {expiryStatus === 'expiring-soon' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-yellow-700">
                            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    )}

                    {pkg.remainingLessons > 0 && expiryStatus !== 'expired' && (
                      <Link 
                        href="/portal/student/book"
                        className="w-full btn btn-primary text-center"
                      >
                        Book Lesson
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Packages */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-lg font-semibold text-barn-900 mb-6">Available Packages</h2>
          
          {isLoadingAvailable ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper-600 mx-auto mb-4"></div>
              <p className="text-barn-700">Loading available packages...</p>
            </div>
          ) : availablePackages.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-barn-400 mx-auto mb-4" />
              <p className="text-barn-700">No packages available at the moment.</p>
              <p className="text-sm text-barn-600 mt-2">Please check back later or contact us for more information.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availablePackages.map((pkg) => (
                <div key={pkg.id} className={`border rounded-lg p-6 relative ${
                  pkg.isPopular ? 'border-copper-300 bg-copper-50' : 'border-butter-300'
                }`}>
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-copper-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold text-barn-900 mb-2">{pkg.name}</h3>
                    <p className="text-sm text-barn-700">{pkg.description}</p>
                  </div>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-barn-900 mb-1">${pkg.price}</div>
                    <div className="text-sm text-barn-600">{pkg.totalLessons} lessons</div>
                    <div className="text-sm text-barn-600">Valid for {pkg.duration} days</div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-barn-700">Flexible scheduling</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-barn-700">Professional instructors</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-barn-700">Well-trained horses</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full btn ${pkg.isPopular ? 'btn-primary' : 'btn-outline'}`}
                  >
                    Purchase Package
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Purchase Confirmation Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-barn-900 mb-4">Confirm Purchase</h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="font-medium text-barn-700">Package:</span>
                <p className="text-barn-900">{selectedPackage.name}</p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Description:</span>
                <p className="text-barn-900">{selectedPackage.description}</p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Lessons:</span>
                <p className="text-barn-900">{selectedPackage.totalLessons} lessons</p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Duration:</span>
                <p className="text-barn-900">{selectedPackage.duration} days</p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Price:</span>
                <p className="text-barn-900">${selectedPackage.price}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedPackage(null)}
                className="flex-1 btn btn-outline"
                disabled={isPurchasing}
              >
                Cancel
              </button>
              <button
                onClick={() => handlePurchasePackage(selectedPackage)}
                disabled={isPurchasing}
                className="flex-1 btn btn-primary"
              >
                {isPurchasing ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
