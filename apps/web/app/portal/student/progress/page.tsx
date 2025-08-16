'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { studentAPI } from '@/lib/auth';
import { BookOpen, Calendar, Clock, User, MapPin, Star, ArrowLeft, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';

interface LessonBooking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'completed' | 'cancelled' | 'upcoming';
  instructor?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  horse?: {
    id: string;
    name: string;
  } | null;
  lessonType?: {
    id: string;
    name: string;
  } | null;
  progressNote?: ProgressNote;
}

interface ProgressNote {
  id: string;
  lessonBookingId: string;
  skillsWorkedOn: string[];
  strengths: string[];
  areasForImprovement: string[];
  instructorNotes: string;
  rating: number; // 1-5 stars
  nextLessonFocus: string;
  createdAt: string;
}

interface ProgressStats {
  totalLessons: number;
  completedLessons: number;
  averageRating: number;
  skillsMastered: string[];
  currentFocus: string;
}

export default function ProgressPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [bookings, setBookings] = useState<LessonBooking[]>([]);
  const [progressStats, setProgressStats] = useState<ProgressStats | null>(null);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<LessonBooking | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookings();
      loadProgressStats();
    }
  }, [isAuthenticated]);

  const loadBookings = async () => {
    try {
      setIsLoadingBookings(true);
      const response = await studentAPI.getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const loadProgressStats = async () => {
    try {
      const response = await studentAPI.getProgressStats();
      setProgressStats(response.data);
    } catch (error) {
      console.error('Error loading progress stats:', error);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    return booking.status === filterStatus;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
              <h1 className="text-xl font-semibold text-barn-900">Progress Tracking</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Progress Stats */}
        {progressStats && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <h2 className="text-lg font-semibold text-barn-900 mb-6">Your Progress Overview</h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-sage-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-sage-600" />
                </div>
                <p className="text-2xl font-bold text-barn-900">{progressStats.totalLessons}</p>
                <p className="text-sm text-barn-600">Total Lessons</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-barn-900">{progressStats.completedLessons}</p>
                <p className="text-sm text-barn-600">Completed</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-barn-900">{progressStats.averageRating.toFixed(1)}</p>
                <p className="text-sm text-barn-600">Avg Rating</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-copper-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-copper-600" />
                </div>
                <p className="text-2xl font-bold text-barn-900">{progressStats.skillsMastered.length}</p>
                <p className="text-sm text-barn-600">Skills Mastered</p>
              </div>
            </div>

            {progressStats.currentFocus && (
              <div className="bg-copper-50 border border-copper-200 rounded-lg p-4">
                <h3 className="font-medium text-copper-900 mb-2">Current Focus Area</h3>
                <p className="text-copper-800">{progressStats.currentFocus}</p>
              </div>
            )}
          </div>
        )}

        {/* Skills Mastered */}
        {progressStats?.skillsMastered && progressStats.skillsMastered.length > 0 && (
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <h2 className="text-lg font-semibold text-barn-900 mb-4">Skills You've Mastered</h2>
            <div className="flex flex-wrap gap-2">
              {progressStats.skillsMastered.map((skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Lesson History */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-barn-900">Lesson History</h2>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500"
            >
              <option value="all">All Lessons</option>
              <option value="completed">Completed</option>
              <option value="upcoming">Upcoming</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {isLoadingBookings ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper-600 mx-auto mb-4"></div>
              <p className="text-barn-700">Loading lesson history...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-barn-400 mx-auto mb-4" />
              <p className="text-barn-700">No lessons found.</p>
              <p className="text-sm text-barn-600 mt-2">
                {filterStatus === 'all' 
                  ? "You haven't taken any lessons yet." 
                  : `No ${filterStatus} lessons found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map((booking) => (
                <div key={booking.id} className="border border-butter-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-barn-900">
                        {formatDate(booking.date)}
                      </span>
                      <span className="text-sm text-barn-600">
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-barn-400" />
                      <span className="text-sm text-barn-700">
                        {booking.instructor ? `${booking.instructor.firstName} ${booking.instructor.lastName}` : 'Instructor TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-barn-400" />
                      <span className="text-sm text-barn-700">{booking.horse ? booking.horse.name : 'Horse TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-barn-400" />
                      <span className="text-sm text-barn-700">{booking.lessonType ? booking.lessonType.name : 'Lesson Type TBD'}</span>
                    </div>
                  </div>

                  {booking.progressNote && (
                    <div className="border-t border-butter-300 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-barn-900">Instructor Notes</h4>
                        <div className="flex items-center gap-1">
                          {renderStars(booking.progressNote.rating)}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {booking.progressNote.skillsWorkedOn.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-barn-700 mb-1">Skills Worked On:</h5>
                            <div className="flex flex-wrap gap-1">
                              {booking.progressNote.skillsWorkedOn.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {booking.progressNote.strengths.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-barn-700 mb-1">Strengths:</h5>
                            <div className="flex flex-wrap gap-1">
                              {booking.progressNote.strengths.map((strength, index) => (
                                <span
                                  key={index}
                                  className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {booking.progressNote.areasForImprovement.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-barn-700 mb-1">Areas for Improvement:</h5>
                            <div className="flex flex-wrap gap-1">
                              {booking.progressNote.areasForImprovement.map((area, index) => (
                                <span
                                  key={index}
                                  className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs"
                                >
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {booking.progressNote.instructorNotes && (
                          <div>
                            <h5 className="text-sm font-medium text-barn-700 mb-1">Notes:</h5>
                            <p className="text-sm text-barn-700">{booking.progressNote.instructorNotes}</p>
                          </div>
                        )}

                        {booking.progressNote.nextLessonFocus && (
                          <div>
                            <h5 className="text-sm font-medium text-barn-700 mb-1">Next Lesson Focus:</h5>
                            <p className="text-sm text-barn-700">{booking.progressNote.nextLessonFocus}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {booking.status === 'upcoming' && (
                    <div className="border-t border-butter-300 pt-4 mt-4">
                      <button
                        onClick={() => {
                          // Handle lesson cancellation
                          if (confirm('Are you sure you want to cancel this lesson?')) {
                            // Call cancel API
                          }
                        }}
                        className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50"
                      >
                        Cancel Lesson
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
