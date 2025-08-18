'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  Heart, 
  Calendar, 
  BarChart3, 
  Settings,
  BookOpen,
  DollarSign,
  LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, userType, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'admin')) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, userType, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  const adminCards = [
    {
      title: 'Horse Management',
      description: 'Manage horses, their profiles, and availability',
      icon: Heart,
      href: '/portal/admin/horses',
      color: 'bg-green-500',
      stats: '12 Active Horses'
    },
    {
      title: 'Student Management',
      description: 'View and manage student accounts and progress',
      icon: Users,
      href: '/portal/admin/students',
      color: 'bg-blue-500',
      stats: '45 Students'
    },
    {
      title: 'Calendar & Scheduling',
      description: 'Outlook-style calendar with daily/weekly views, event management, and safety criteria',
      icon: Calendar,
      href: '/portal/admin/calendar',
      color: 'bg-purple-500',
      stats: '156 Upcoming Lessons'
    },
    {
      title: 'Announcements',
      description: 'Create and manage announcements for all users',
      icon: BookOpen,
      href: '/portal/admin/announcements',
      color: 'bg-yellow-500',
      stats: 'Manage Content'
    },
    {
      title: 'Lesson Types',
      description: 'Configure lesson types, pricing, and requirements',
      icon: BookOpen,
      href: '/portal/admin/lesson-types',
      color: 'bg-orange-500',
      stats: '8 Lesson Types'
    },
    {
      title: 'Analytics & Reports',
      description: 'View business metrics and performance reports',
      icon: BarChart3,
      href: '/portal/admin/analytics',
      color: 'bg-indigo-500',
      stats: 'Monthly Reports'
    },
    {
      title: 'Settings',
      description: 'Manage system settings and configurations',
      icon: Settings,
      href: '/portal/admin/settings',
      color: 'bg-gray-500',
      stats: 'System Config'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Welcome back, {user?.firstName}! Manage your equestrian business.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Students</p>
                <p className="text-2xl font-semibold text-gray-900">45</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Horses</p>
                <p className="text-2xl font-semibold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Week's Lessons</p>
                <p className="text-2xl font-semibold text-gray-900">23</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">$12,450</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-lg ${card.color} bg-opacity-10`}>
                      <IconComponent className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{card.description}</p>
                      <p className="mt-2 text-xs font-medium text-blue-600">{card.stats}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    New lesson booking: Sarah Johnson booked Beginner Riding for tomorrow
                  </p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    New student registration: Michael Chen joined the platform
                  </p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    Package purchased: Emma Davis bought the Advanced Package
                  </p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
