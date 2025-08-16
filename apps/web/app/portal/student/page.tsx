'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { studentAPI, Student } from '@/lib/auth';
import { Calendar, Clock, MapPin, Users, Package, BookOpen, User, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function StudentPortalPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [studentProfile, setStudentProfile] = useState<Student | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadStudentProfile();
    }
  }, [isAuthenticated]);

  const loadStudentProfile = async () => {
    try {
      const response = await studentAPI.getProfile();
      setStudentProfile(response.data);
    } catch (error) {
      console.error('Error loading student profile:', error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || isLoadingProfile) {
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
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-butter-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-butter-300">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-barn-900 rounded-full flex items-center justify-center">
                  <span className="text-butter-300 font-bold text-sm">H4H</span>
                </div>
                <span className="text-barn-900 font-bold">Hearts4Horses</span>
              </Link>
              <div className="h-6 w-px bg-butter-300"></div>
              <h1 className="text-xl font-semibold text-barn-900">Student Portal</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-barn-700">
                <User className="w-4 h-4" />
                <span>Welcome, {user?.firstName}!</span>
              </div>
              <button 
                onClick={handleLogout}
                className="btn btn-outline flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
          <h2 className="text-2xl font-bold text-barn-900 mb-2">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-barn-700">
            Manage your lessons, track your progress, and explore upcoming opportunities.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-barn-900">0</p>
                <p className="text-sm text-barn-600">Upcoming Lessons</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-copper-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-copper-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-barn-900">0</p>
                <p className="text-sm text-barn-600">Active Packages</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-barn-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-barn-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-barn-900">0</p>
                <p className="text-sm text-barn-600">Progress Notes</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-butter-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-butter-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-barn-900">0</p>
                <p className="text-sm text-barn-600">Total Lessons</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Book a Lesson */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="text-lg font-semibold text-barn-900 mb-2">Book a Lesson</h3>
            <p className="text-barn-700 mb-4">
              Browse available time slots and book your next riding lesson.
            </p>
            <Link href="/portal/student/book" className="btn btn-primary w-full">
              View Available Slots
            </Link>
          </div>

          {/* My Bookings */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-copper-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-copper-600" />
            </div>
            <h3 className="text-lg font-semibold text-barn-900 mb-2">My Bookings</h3>
            <p className="text-barn-700 mb-4">
              View and manage your upcoming and past lesson bookings.
            </p>
            <Link href="/portal/student/progress" className="btn btn-outline w-full">
              View Bookings
            </Link>
          </div>

          {/* My Packages */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-barn-100 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-barn-600" />
            </div>
            <h3 className="text-lg font-semibold text-barn-900 mb-2">My Packages</h3>
            <p className="text-barn-700 mb-4">
              Check your lesson packages and remaining lessons.
            </p>
            <Link href="/portal/student/packages" className="btn btn-outline w-full">
              View Packages
            </Link>
          </div>

          {/* Progress Tracking */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-butter-100 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-butter-600" />
            </div>
            <h3 className="text-lg font-semibold text-barn-900 mb-2">Progress Tracking</h3>
            <p className="text-barn-700 mb-4">
              Review instructor notes and track your riding progress.
            </p>
            <Link href="/portal/student/progress" className="btn btn-outline w-full">
              View Progress
            </Link>
          </div>

          {/* My Profile */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-sage-600" />
            </div>
            <h3 className="text-lg font-semibold text-barn-900 mb-2">My Profile</h3>
            <p className="text-barn-700 mb-4">
              Update your personal information and preferences.
            </p>
            <button className="btn btn-outline w-full">
              Edit Profile
            </button>
          </div>

          {/* Contact Support */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-copper-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-copper-600" />
            </div>
            <h3 className="text-lg font-semibold text-barn-900 mb-2">Contact Support</h3>
            <p className="text-barn-700 mb-4">
              Get help with bookings, packages, or any questions.
            </p>
            <Link href="/contact" className="btn btn-outline w-full">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Student Profile Info */}
        {studentProfile && (
          <div className="mt-8 bg-white rounded-2xl shadow-soft p-8">
            <h3 className="text-xl font-semibold text-barn-900 mb-6">Student Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-barn-900 mb-2">Personal Details</h4>
                <div className="space-y-2 text-sm text-barn-700">
                  <p><span className="font-medium">Name:</span> {studentProfile.user.firstName} {studentProfile.user.lastName}</p>
                  <p><span className="font-medium">Email:</span> {studentProfile.user.email}</p>
                  {studentProfile.user.phone && (
                    <p><span className="font-medium">Phone:</span> {studentProfile.user.phone}</p>
                  )}
                  {studentProfile.dateOfBirth && (
                    <p><span className="font-medium">Date of Birth:</span> {new Date(studentProfile.dateOfBirth).toLocaleDateString()}</p>
                  )}
                  {studentProfile.experienceLevel && (
                    <p><span className="font-medium">Experience Level:</span> {studentProfile.experienceLevel}</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-barn-900 mb-2">Account Status</h4>
                <div className="space-y-2 text-sm text-barn-700">
                  <p><span className="font-medium">Member Since:</span> {new Date(studentProfile.user.createdAt).toLocaleDateString()}</p>
                  <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Active</span></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
