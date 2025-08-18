'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { weatherAPI, WeatherData, WeatherForecast } from '@/lib/weather';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  User,
  Bell,
  Clock,
  AlertCircle,
  ChevronRight,
  LogOut,
  Sun,
  MessageSquare,
  Award,
  Cloud,
  CloudRain,
  CloudSnow,
  Wind
} from 'lucide-react';

interface UserRole {
  id: number;
  key: string;
  name: string;
}

interface PortalCard {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
  stats?: string;
  badge?: string;
}

export default function UnifiedUserPortal() {
  const { user, userType, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && user) {
      loadUserRoles();
      loadNotifications();
      loadAnnouncements();
      loadWeather();
    }
  }, [isAuthenticated, user, isLoading, router]);

  const loadUserRoles = async () => {
    try {
      const response = await fetch('/api/v1/auth/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserRoles(data.roles || []);
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/v1/user/notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const response = await fetch('/api/v1/user/announcements', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  const loadWeather = async () => {
    try {
      const weatherData = await weatherAPI.getLessonWeather('Hearts4Horses Equestrian Center');
      setWeather(weatherData.current);
      setForecast(weatherData.forecast);
    } catch (error) {
      console.error('Error loading weather:', error);
      // Fallback weather data
      setWeather({
        temperature: '72°F',
        condition: 'Sunny',
        location: 'Hearts4Horses Equestrian Center',
        humidity: '45%',
        windSpeed: '8 mph',
        feelsLike: '74°F'
      });
    }
  };

  const getPortalCards = (): PortalCard[] => {
    const cards: PortalCard[] = [];

    // Check if user has student role
    if (userRoles.some(role => role.key === 'student')) {
      cards.push({
        id: 'student',
        title: 'Student Portal',
        description: 'Book lessons, track progress, manage packages',
        icon: BookOpen,
        href: '/portal/user/student',
        color: 'bg-blue-500',
        stats: '3 lessons remaining',
        badge: 'Active'
      });
    }

    // Check if user has instructor role
    if (userRoles.some(role => role.key === 'instructor')) {
      cards.push({
        id: 'instructor',
        title: 'Instructor Portal',
        description: 'Manage students, schedule lessons, track progress',
        icon: Users,
        href: '/portal/user/instructor',
        color: 'bg-purple-500',
        stats: '2 students today',
        badge: 'Teaching'
      });
    }

    // Check if user has admin role
    if (userRoles.some(role => role.key === 'admin')) {
      cards.push({
        id: 'admin',
        title: 'Admin Dashboard',
        description: 'Manage horses, students, calendar, and system settings',
        icon: Settings,
        href: '/portal/user/admin',
        color: 'bg-green-500',
        stats: '45 students, 12 horses',
        badge: 'Admin'
      });
    }

    // Check if user has staff role
    if (userRoles.some(role => role.key === 'staff')) {
      cards.push({
        id: 'staff',
        title: 'Staff Portal',
        description: 'Assist with operations, customer service, and support',
        icon: User,
        href: '/portal/user/staff',
        color: 'bg-orange-500',
        stats: '5 tasks pending',
        badge: 'Staff'
      });
    }

    return cards;
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter(n => !n.isRead).length;
  };

  const getUnreadAnnouncementsCount = () => {
    return announcements.filter(a => !a.isRead).length;
  };

  const getWeatherRecommendation = () => {
    if (!weather) return null;
    
    const temp = parseInt(weather.temperature);
    const condition = weather.condition.toLowerCase();
    
    if (condition.includes('rain') || condition.includes('storm')) {
      return {
        type: 'warning',
        message: 'Weather Alert: Rain expected. Indoor lessons recommended.',
        icon: CloudRain
      };
    }
    
    if (condition.includes('snow') || temp < 32) {
      return {
        type: 'warning',
        message: 'Weather Alert: Cold conditions. Dress warmly for outdoor lessons.',
        icon: CloudSnow
      };
    }
    
    if (temp > 85) {
      return {
        type: 'info',
        message: 'Hot weather: Stay hydrated and consider early morning lessons.',
        icon: Sun
      };
    }
    
    if (temp >= 65 && temp <= 75 && !condition.includes('rain')) {
      return {
        type: 'success',
        message: 'Perfect riding weather! Great conditions for lessons.',
        icon: Sun
      };
    }
    
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const portalCards = getPortalCards();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
              <p className="mt-1 text-sm text-gray-500">
                Access your portals and stay updated with important information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {getUnreadNotificationsCount()} notifications
                </span>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather and Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Widget */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Weather</h3>
                <p className="text-3xl font-bold text-blue-600">{weather?.temperature}</p>
                <p className="text-gray-600">{weather?.condition}</p>
                <p className="text-sm text-gray-500">{weather?.location}</p>
              </div>
              {weather?.condition?.toLowerCase().includes('rain') ? (
                <CloudRain className="h-12 w-12 text-blue-500" />
              ) : weather?.condition?.toLowerCase().includes('snow') ? (
                <CloudSnow className="h-12 w-12 text-gray-400" />
              ) : weather?.condition?.toLowerCase().includes('cloud') ? (
                <Cloud className="h-12 w-12 text-gray-500" />
              ) : (
                <Sun className="h-12 w-12 text-yellow-500" />
              )}
            </div>
            
            {/* Weather Details */}
            {weather?.humidity && weather?.windSpeed && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Wind className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{weather.windSpeed}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Humidity: {weather.humidity}</span>
                </div>
              </div>
            )}

            {/* 3-Day Forecast */}
            {forecast.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">3-Day Forecast</h4>
                <div className="space-y-2">
                  {forecast.slice(0, 3).map((day, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{day.date}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-900">{day.high}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-600">{day.low}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{day.condition}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/portal/user/student/book"
                className="flex items-center justify-between p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
              >
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-blue-600 mr-3" />
                  <span className="text-sm font-medium text-blue-900">Book a Lesson</span>
                </div>
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </Link>
              <Link
                href="/portal/user/notifications"
                className="flex items-center justify-between p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-purple-600 mr-3" />
                  <span className="text-sm font-medium text-purple-900">View Notifications</span>
                </div>
                <ChevronRight className="h-4 w-4 text-purple-600" />
              </Link>
              <Link
                href="/portal/user/messages"
                className="flex items-center justify-between p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
              >
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-green-900">Messages</span>
                </div>
                <ChevronRight className="h-4 w-4 text-green-600" />
              </Link>
            </div>
          </div>

          {/* Notifications Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    notification.priority === 'high' ? 'bg-red-500' : 
                    notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 truncate">{notification.title}</p>
                    <p className="text-xs text-gray-500">{notification.timeAgo}</p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <p className="text-sm text-gray-500">No recent notifications</p>
              )}
            </div>
          </div>
        </div>

        {/* Announcements */}
        {announcements.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Announcements</h3>
              {getUnreadAnnouncementsCount() > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {getUnreadAnnouncementsCount()} new
                </span>
              )}
            </div>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  announcement.isRead ? 'bg-gray-50 border-gray-200' : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{announcement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{announcement.content}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        From {announcement.from} • {announcement.timeAgo}
                      </p>
                    </div>
                    {!announcement.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full ml-3 mt-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portal Cards */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Portals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {portalCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <Link
                  key={card.id}
                  href={card.href}
                  className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                >
                  <div className={`h-2 ${card.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg ${card.color} bg-opacity-10`}>
                        <IconComponent className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                      </div>
                      {card.badge && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {card.badge}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                    {card.stats && (
                      <p className="text-sm font-medium text-gray-900">{card.stats}</p>
                    )}
                    <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                      Access Portal
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Weather Recommendation */}
        {getWeatherRecommendation() && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Weather Recommendation</h3>
            <div className="space-y-3">
              {(() => {
                const recommendation = getWeatherRecommendation();
                if (!recommendation) return null;
                
                const bgColor = recommendation.type === 'warning' ? 'bg-red-50' : 
                               recommendation.type === 'success' ? 'bg-green-50' : 'bg-blue-50';
                const textColor = recommendation.type === 'warning' ? 'text-red-900' : 
                                 recommendation.type === 'success' ? 'text-green-900' : 'text-blue-900';
                const iconColor = recommendation.type === 'warning' ? 'text-red-600' : 
                                 recommendation.type === 'success' ? 'text-green-600' : 'text-blue-600';
                
                return (
                  <div className={`flex items-center space-x-3 p-3 rounded-lg ${bgColor}`}>
                    <recommendation.icon className={`h-5 w-5 ${iconColor}`} />
                    <div>
                      <p className={`text-sm font-medium ${textColor}`}>{recommendation.message}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Upcoming Events & Reminders */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events & Reminders</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Lesson tomorrow at 3:00 PM</p>
                <p className="text-xs text-yellow-700">Beginner Riding with Gentle Spirit</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-50">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-900">Package expires in 5 days</p>
                <p className="text-xs text-red-700">3 lessons remaining - schedule soon!</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-blue-50">
              <Award className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">New announcement from instructor</p>
                <p className="text-xs text-blue-700">Check your messages for updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
