'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart3, 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Award,
  Activity
} from 'lucide-react';

interface AnalyticsData {
  revenue: {
    current: number;
    previous: number;
    change: number;
  };
  students: {
    current: number;
    previous: number;
    change: number;
  };
  lessons: {
    current: number;
    previous: number;
    change: number;
  };
  satisfaction: {
    current: number;
    previous: number;
    change: number;
  };
}

export default function AdminAnalyticsPage() {
  const { user, userType, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'admin')) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && userType === 'admin') {
      loadAnalytics();
    }
  }, [isAuthenticated, userType, isLoading, router]);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/v1/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnalytics(data.analytics || null);
      } else {
        // Mock data for development
        setAnalytics({
          revenue: {
            current: 12450,
            previous: 11800,
            change: 5.5
          },
          students: {
            current: 45,
            previous: 42,
            change: 7.1
          },
          lessons: {
            current: 156,
            previous: 142,
            change: 9.9
          },
          satisfaction: {
            current: 4.8,
            previous: 4.7,
            change: 2.1
          }
        });
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? TrendingUp : TrendingDown;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Link
                href="/portal/user"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
                <p className="mt-1 text-sm text-gray-500">
                  View business metrics and performance reports
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {analytics && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Revenue */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">Monthly Revenue</p>
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(analytics.revenue.current)}</p>
                    <div className="flex items-center mt-1">
                      {(() => {
                        const IconComponent = getChangeIcon(analytics.revenue.change);
                        return <IconComponent className={`h-4 w-4 ${getChangeColor(analytics.revenue.change)}`} />;
                      })()}
                      <span className={`text-sm font-medium ml-1 ${getChangeColor(analytics.revenue.change)}`}>
                        {analytics.revenue.change >= 0 ? '+' : ''}{analytics.revenue.change}%
                      </span>
                      <span className="text-sm text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Students */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">Active Students</p>
                    <p className="text-2xl font-semibold text-gray-900">{analytics.students.current}</p>
                    <div className="flex items-center mt-1">
                      {(() => {
                        const IconComponent = getChangeIcon(analytics.students.change);
                        return <IconComponent className={`h-4 w-4 ${getChangeColor(analytics.students.change)}`} />;
                      })()}
                      <span className={`text-sm font-medium ml-1 ${getChangeColor(analytics.students.change)}`}>
                        {analytics.students.change >= 0 ? '+' : ''}{analytics.students.change}%
                      </span>
                      <span className="text-sm text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">Lessons This Month</p>
                    <p className="text-2xl font-semibold text-gray-900">{analytics.lessons.current}</p>
                    <div className="flex items-center mt-1">
                      {(() => {
                        const IconComponent = getChangeIcon(analytics.lessons.change);
                        return <IconComponent className={`h-4 w-4 ${getChangeColor(analytics.lessons.change)}`} />;
                      })()}
                      <span className={`text-sm font-medium ml-1 ${getChangeColor(analytics.lessons.change)}`}>
                        {analytics.lessons.change >= 0 ? '+' : ''}{analytics.lessons.change}%
                      </span>
                      <span className="text-sm text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Satisfaction */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-500">Student Satisfaction</p>
                    <p className="text-2xl font-semibold text-gray-900">{analytics.satisfaction.current}/5.0</p>
                    <div className="flex items-center mt-1">
                      {(() => {
                        const IconComponent = getChangeIcon(analytics.satisfaction.change);
                        return <IconComponent className={`h-4 w-4 ${getChangeColor(analytics.satisfaction.change)}`} />;
                      })()}
                      <span className={`text-sm font-medium ml-1 ${getChangeColor(analytics.satisfaction.change)}`}>
                        {analytics.satisfaction.change >= 0 ? '+' : ''}{analytics.satisfaction.change}%
                      </span>
                      <span className="text-sm text-gray-500 ml-2">vs last month</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                  <p className="text-sm text-gray-500">Monthly revenue over the past 6 months</p>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Chart visualization coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Growth */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Student Growth</h3>
                  <p className="text-sm text-gray-500">New student registrations over time</p>
                </div>
                <div className="p-6">
                  <div className="h-64 flex items-center justify-center">
                    <div className="text-center">
                      <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Chart visualization coming soon</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Types */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Lesson Types</h3>
                  <p className="text-sm text-gray-500">Distribution of lesson types</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Private Lessons</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">65%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Group Lessons</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">25%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                        <span className="text-sm text-gray-700">Trail Rides</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">10%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Horses */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Top Performing Horses</h3>
                  <p className="text-sm text-gray-500">Horses with highest lesson counts</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-blue-600">GS</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Gentle Spirit</p>
                          <p className="text-xs text-gray-500">Quarter Horse</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">45 lessons</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-green-600">T</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Thunder</p>
                          <p className="text-xs text-gray-500">Thoroughbred</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">38 lessons</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-purple-600">L</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Luna</p>
                          <p className="text-xs text-gray-500">Arabian</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">32 lessons</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
