'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, 
  Plus, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  MapPin
} from 'lucide-react';

interface Lesson {
  id: number;
  title: string;
  student: string;
  instructor: string;
  horse: string;
  date: string;
  time: string;
  duration: number;
  type: 'private' | 'group' | 'trail';
  status: 'scheduled' | 'completed' | 'cancelled';
}

export default function AdminCalendarPage() {
  const { user, userType, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'admin')) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && userType === 'admin') {
      loadLessons();
    }
  }, [isAuthenticated, userType, isLoading, router]);

  const loadLessons = async () => {
    try {
      const response = await fetch('/api/v1/admin/calendar', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLessons(data.lessons || []);
      } else {
        // Mock data for development
        setLessons([
          {
            id: 1,
            title: 'Beginner Riding',
            student: 'Sarah Johnson',
            instructor: 'Mike Wilson',
            horse: 'Gentle Spirit',
            date: '2024-03-15',
            time: '10:00 AM',
            duration: 60,
            type: 'private',
            status: 'scheduled'
          },
          {
            id: 2,
            title: 'Intermediate Lesson',
            student: 'Michael Chen',
            instructor: 'Lisa Davis',
            horse: 'Thunder',
            date: '2024-03-15',
            time: '2:00 PM',
            duration: 60,
            type: 'private',
            status: 'scheduled'
          },
          {
            id: 3,
            title: 'Advanced Jumping',
            student: 'Emily Davis',
            instructor: 'Mike Wilson',
            horse: 'Luna',
            date: '2024-03-15',
            time: '4:00 PM',
            duration: 90,
            type: 'private',
            status: 'scheduled'
          },
          {
            id: 4,
            title: 'Group Trail Ride',
            student: 'Group Lesson',
            instructor: 'Lisa Davis',
            horse: 'Multiple',
            date: '2024-03-16',
            time: '9:00 AM',
            duration: 120,
            type: 'group',
            status: 'scheduled'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    return { daysInMonth, startingDay };
  };

  const getLessonsForDate = (date: string) => {
    return lessons.filter(lesson => lesson.date === date);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    if (!type) return 'bg-gray-100 text-gray-800';
    switch (type) {
      case 'private': return 'bg-purple-100 text-purple-800';
      case 'group': return 'bg-orange-100 text-orange-800';
      case 'trail': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string | undefined | null) => {
    if (!status || typeof status !== 'string') return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatType = (type: string | undefined | null) => {
    if (!type || typeof type !== 'string') return 'Unknown';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (isLoading || !lessons) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Calendar & Scheduling</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage lessons and events
                </p>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Lesson
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Calendar Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-semibold text-gray-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Today
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="bg-gray-50 p-3 text-center">
                <span className="text-sm font-medium text-gray-900">{day}</span>
              </div>
            ))}

            {/* Empty cells for days before the first day of the month */}
            {Array.from({ length: startingDay }, (_, i) => (
              <div key={`empty-${i}`} className="bg-white p-3 min-h-[120px]"></div>
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const dateString = formatDate(date);
              const dayLessons = getLessonsForDate(dateString);
              const isToday = date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={day}
                  className={`bg-white p-3 min-h-[120px] ${isToday ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                      {day}
                    </span>
                    {dayLessons.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full">
                        {dayLessons.length}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {dayLessons.slice(0, 2).map(lesson => (
                      <div
                        key={lesson.id}
                        className="text-xs p-1 rounded bg-blue-100 text-blue-800 truncate"
                        title={`${lesson.time} - ${lesson.title} with ${lesson.student}`}
                      >
                        {lesson.time} - {lesson.title}
                      </div>
                    ))}
                    {dayLessons.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{dayLessons.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Lessons</h3>
          </div>
          <div className="p-6">
            {lessons && lessons.length > 0 ? (
              <div className="space-y-4">
                {lessons.slice(0, 5).map(lesson => {
                  if (!lesson || !lesson.id) return null;
                  return (
                  <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{lesson.title}</h4>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{lesson.student}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{lesson.horse}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{lesson.date}</div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{lesson.time} ({lesson.duration}min)</span>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-1">
                                                                                           <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(lesson.type)}`}>
                                            {formatType(lesson.type)}
                                          </span>
                                                   <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                            {formatStatus(lesson.status)}
                          </span>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming lessons</h3>
                <p className="text-gray-500">Schedule some lessons to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
