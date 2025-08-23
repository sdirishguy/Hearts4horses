'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { weatherAPI, WeatherData, WeatherForecast } from '@/lib/weather';
import LogoutConfirmation from '@/components/LogoutConfirmation';
import SessionTimer from '@/components/SessionTimer';
import ActivityDashboard from '@/components/ActivityDashboard';
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
  Wind,
  Heart,
  DollarSign,
  BarChart3,
  FileText,
  Shield,
  Star,
  TrendingUp,
  Activity,
  Home
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

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: any;
  href: string;
  color: string;
}

export default function UnifiedUserPortal() {
  const { user, userType, isLoading, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  // Confirmation dialog state
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    destination: string;
    destinationName: string;
  } | null>(null);
  
  // Session timer state
  const [showSessionSettings, setShowSessionSettings] = useState(false);
  
  // Activity dashboard state
  const [showActivityDashboard, setShowActivityDashboard] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleExtendSession = () => {
    // This will be called when user extends session from timer
    console.log('Session extended');
  };

  const handleNavigateToUnprotectedRoute = (destination: string, destinationName: string) => {
    setPendingNavigation({ destination, destinationName });
    setShowLogoutConfirmation(true);
  };

  const handleConfirmNavigation = () => {
    if (pendingNavigation) {
      logout();
      router.push(pendingNavigation.destination);
    }
    setShowLogoutConfirmation(false);
    setPendingNavigation(null);
  };

  const handleQuickActionClick = (action: QuickAction) => {
    if (action.id === 'activity') {
      setShowActivityDashboard(!showActivityDashboard);
    } else if (action.href.startsWith('/')) {
      router.push(action.href);
    }
  };

  const handleCancelNavigation = () => {
    setShowLogoutConfirmation(false);
    setPendingNavigation(null);
  };

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

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

  const getQuickActions = (): QuickAction[] => {
    const actions: QuickAction[] = [];

    // Admin-specific actions
    if (userRoles.some(role => role.key === 'admin')) {
      actions.push(
        {
          id: 'horses',
          title: 'Manage Horses',
          description: 'Add, edit, and manage horse profiles',
          icon: Heart,
          href: '/portal/user/admin/horses',
          color: 'bg-green-500'
        },
        {
          id: 'students',
          title: 'Student Management',
          description: 'View and manage student accounts',
          icon: Users,
          href: '/portal/user/admin/students',
          color: 'bg-blue-500'
        },
        {
          id: 'calendar',
          title: 'Calendar & Scheduling',
          description: 'Manage lessons and events',
          icon: Calendar,
          href: '/portal/user/admin/calendar',
          color: 'bg-purple-500'
        },
        {
          id: 'analytics',
          title: 'Analytics & Reports',
          description: 'View business metrics and reports',
          icon: BarChart3,
          href: '/portal/user/admin/analytics',
          color: 'bg-indigo-500'
        }
      );
    }

    // Instructor-specific actions
    if (userRoles.some(role => role.key === 'instructor')) {
      actions.push(
        {
          id: 'my-students',
          title: 'My Students',
          description: 'View and manage your students',
          icon: Users,
          href: '/portal/user/instructor/students',
          color: 'bg-purple-500'
        },
        {
          id: 'schedule',
          title: 'My Schedule',
          description: 'View your teaching schedule',
          icon: Calendar,
          href: '/portal/user/instructor/schedule',
          color: 'bg-blue-500'
        },
        {
          id: 'progress',
          title: 'Student Progress',
          description: 'Track student development',
          icon: TrendingUp,
          href: '/portal/user/instructor/progress',
          color: 'bg-green-500'
        }
      );
    }

    // Student-specific actions
    if (userRoles.some(role => role.key === 'student')) {
      actions.push(
        {
          id: 'book-lesson',
          title: 'Book a Lesson',
          description: 'Schedule your next riding lesson',
          icon: Calendar,
          href: '/portal/user/student/book',
          color: 'bg-blue-500'
        },
        {
          id: 'my-lessons',
          title: 'My Lessons',
          description: 'View upcoming and past lessons',
          icon: BookOpen,
          href: '/portal/user/student/lessons',
          color: 'bg-green-500'
        },
        {
          id: 'progress',
          title: 'My Progress',
          description: 'Track your riding progress',
          icon: TrendingUp,
          href: '/portal/user/student/progress',
          color: 'bg-purple-500'
        }
      );
    }

    // Common actions for all users
    actions.push(
      {
        id: 'profile',
        title: 'My Profile',
        description: 'Update your personal information',
        icon: User,
        href: '/portal/user/profile',
        color: 'bg-gray-500'
      },
      {
        id: 'notifications',
        title: 'Notifications',
        description: 'Manage your notification preferences',
        icon: Bell,
        href: '/portal/user/notifications',
        color: 'bg-yellow-500'
      },
      {
        id: 'activity',
        title: 'Activity Dashboard',
        description: 'View your activity history and analytics',
        icon: Activity,
        href: '#',
        color: 'bg-indigo-500'
      }
    );

    return actions;
  };

  const getRoleSpecificStats = () => {
    const stats = [];

    // Admin stats
    if (userRoles.some(role => role.key === 'admin')) {
      stats.push(
        { label: 'Total Students', value: '45', icon: Users, color: 'text-blue-600' },
        { label: 'Active Horses', value: '12', icon: Heart, color: 'text-green-600' },
        { label: 'This Week\'s Lessons', value: '23', icon: Calendar, color: 'text-purple-600' },
        { label: 'Monthly Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-600' }
      );
    }

    // Instructor stats
    if (userRoles.some(role => role.key === 'instructor')) {
      stats.push(
        { label: 'My Students', value: '8', icon: Users, color: 'text-purple-600' },
        { label: 'Today\'s Lessons', value: '3', icon: Calendar, color: 'text-blue-600' },
        { label: 'This Week', value: '12', icon: Activity, color: 'text-green-600' },
        { label: 'Student Rating', value: '4.9★', icon: Star, color: 'text-yellow-600' }
      );
    }

    // Student stats
    if (userRoles.some(role => role.key === 'student')) {
      stats.push(
        { label: 'Lessons Completed', value: '24', icon: BookOpen, color: 'text-blue-600' },
        { label: 'Upcoming Lessons', value: '3', icon: Calendar, color: 'text-green-600' },
        { label: 'Current Level', value: 'Intermediate', icon: Award, color: 'text-purple-600' },
        { label: 'Package Balance', value: '5 lessons', icon: DollarSign, color: 'text-orange-600' }
      );
    }

    // Default stats if no specific role
    if (stats.length === 0) {
      stats.push(
        { label: 'Notifications', value: getUnreadNotificationsCount().toString(), icon: Bell, color: 'text-blue-600' },
        { label: 'Announcements', value: getUnreadAnnouncementsCount().toString(), icon: MessageSquare, color: 'text-green-600' },
        { label: 'Active Roles', value: userRoles.length.toString(), icon: Shield, color: 'text-purple-600' }
      );
    }

    return stats;
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

  const getUserTitle = () => {
    const roles = userRoles.map(role => role.name);
    if (roles.length === 0) return 'User';
    if (roles.length === 1) return roles[0];
    return `${roles[0]} & ${roles.length - 1} more`;
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
  const quickActions = getQuickActions();
  const roleStats = getRoleSpecificStats();
  const weatherRecommendation = getWeatherRecommendation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logout Confirmation Dialog */}
      <LogoutConfirmation
        isOpen={showLogoutConfirmation}
        onClose={handleCancelNavigation}
        onConfirm={handleConfirmNavigation}
        destination={pendingNavigation?.destination || ''}
        destinationName={pendingNavigation?.destinationName || ''}
      />

      {/* Session Timer */}
      <SessionTimer
        onLogout={handleLogout}
        onExtendSession={handleExtendSession}
        showSettings={showSessionSettings}
        onShowSettings={setShowSessionSettings}
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.firstName}!</h1>
              <p className="mt-1 text-sm text-gray-500">
                {getUserTitle()} • Access your portals and stay updated with important information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {getUnreadNotificationsCount()} notifications
                </span>
              </div>
              
              {/* Navigation Menu */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSessionSettings(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  title="Session Settings"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleNavigateToUnprotectedRoute('/', 'Home Page')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </button>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Weather and Quick Actions Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Widget */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Weather at Hearts4Horses</h2>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Updated just now</span>
                </div>
              </div>
              
              {weather && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{weather.temperature}</div>
                      <div className="text-sm text-gray-500">{weather.condition}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Feels like: {weather.feelsLike}</div>
                        <div>Humidity: {weather.humidity}</div>
                        <div>Wind: {weather.windSpeed}</div>
                      </div>
                    </div>
                  </div>
                  
                  {weatherRecommendation && (
                    <div className={`p-4 rounded-lg border ${
                      weatherRecommendation.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      weatherRecommendation.type === 'info' ? 'border-blue-200 bg-blue-50' :
                      'border-green-200 bg-green-50'
                    }`}>
                      <div className="flex items-start">
                        <weatherRecommendation.icon className={`h-5 w-5 mt-0.5 mr-3 ${
                          weatherRecommendation.type === 'warning' ? 'text-yellow-600' :
                          weatherRecommendation.type === 'info' ? 'text-blue-600' :
                          'text-green-600'
                        }`} />
                        <div className="text-sm">
                          <p className={`font-medium ${
                            weatherRecommendation.type === 'warning' ? 'text-yellow-800' :
                            weatherRecommendation.type === 'info' ? 'text-blue-800' :
                            'text-green-800'
                          }`}>
                            {weatherRecommendation.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.slice(0, 4).map((action) => {
                const IconComponent = action.icon;
                return (
                  <div
                    key={action.id}
                    onClick={() => handleQuickActionClick(action)}
                    className="block bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 p-2 rounded-lg ${action.color} bg-opacity-10`}>
                        <IconComponent className={`h-5 w-5 ${action.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="ml-3 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">{action.title}</h4>
                        <p className="text-xs text-gray-500">{action.description}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Role-Specific Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roleStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <IconComponent className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Portal Cards */}
        {portalCards.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Portals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portalCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <Link
                    key={card.id}
                    href={card.href}
                    className="group block bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 p-3 rounded-lg ${card.color} bg-opacity-10`}>
                          <IconComponent className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {card.title}
                            </h3>
                            {card.badge && (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                card.badge === 'Admin' ? 'bg-green-100 text-green-800' :
                                card.badge === 'Active' ? 'bg-blue-100 text-blue-800' :
                                card.badge === 'Teaching' ? 'bg-purple-100 text-purple-800' :
                                'bg-orange-100 text-orange-800'
                              }`}>
                                {card.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{card.description}</p>
                          {card.stats && (
                            <p className="text-sm font-medium text-gray-900 mt-2">{card.stats}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Activity Dashboard */}
        {showActivityDashboard && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Activity</h3>
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">Session tracking & analytics</span>
              </div>
            </div>
            <ActivityDashboard />
          </div>
        )}

        {/* Notifications and Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                <Link href="/portal/user/notifications" className="text-sm text-blue-600 hover:text-blue-500">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.slice(0, 3).map((notification, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        notification.isRead ? 'bg-gray-300' : 'bg-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-500">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Announcements */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Announcements</h3>
                <Link href="/portal/user/announcements" className="text-sm text-blue-600 hover:text-blue-500">
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {announcements.length > 0 ? (
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                        announcement.isRead ? 'bg-gray-300' : 'bg-green-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{announcement.title}</p>
                        <p className="text-sm text-gray-500">{announcement.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{announcement.createdAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No announcements yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
