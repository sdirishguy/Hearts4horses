'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { studentAPI } from '@/lib/auth';
import { Calendar, Clock, MapPin, User, ArrowLeft, Check, X } from 'lucide-react';
import Link from 'next/link';

interface AvailabilitySlot {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
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
    duration: number;
    price: number;
  } | null;
  isBooked: boolean;
}

interface LessonType {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
}

export default function BookLessonPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [lessonTypes, setLessonTypes] = useState<LessonType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLessonType, setSelectedLessonType] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadLessonTypes();
      loadAvailableSlots();
    }
  }, [isAuthenticated]);

  const loadLessonTypes = async () => {
    try {
      const response = await studentAPI.getLessonTypes();
      setLessonTypes(response.data);
    } catch (error) {
      console.error('Error loading lesson types:', error);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      setIsLoadingSlots(true);
      const response = await studentAPI.getAvailableSlots();
      setSlots(response.data);
    } catch (error) {
      console.error('Error loading available slots:', error);
    } finally {
      setIsLoadingSlots(false);
    }
  };

  const handleBookLesson = async (slot: AvailabilitySlot) => {
    try {
      setIsBooking(true);
      
      // Validate that required data is available
      if (!slot.lessonType || !slot.horse || !slot.instructor) {
        alert('This slot is missing required information. Please try another slot.');
        return;
      }
      
      await studentAPI.bookLesson({
        slotId: slot.id,
        lessonTypeId: (slot.lessonType as any).id,
        horseId: (slot.horse as any).id,
        instructorId: (slot.instructor as any).id,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        paymentSource: 'package' // or 'credit_card'
      });
      
      // Refresh slots after booking
      await loadAvailableSlots();
      setSelectedSlot(null);
      
      // Show success message or redirect
      alert('Lesson booked successfully!');
    } catch (error: any) {
      console.error('Error booking lesson:', error);
      alert(error.response?.data?.error || 'Failed to book lesson. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const filteredSlots = slots.filter(slot => {
    if (selectedDate && slot.date !== selectedDate) return false;
    if (selectedLessonType && slot.lessonType.id !== selectedLessonType) return false;
    return !slot.isBooked;
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
              <h1 className="text-xl font-semibold text-barn-900">Book a Lesson</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <h2 className="text-lg font-semibold text-barn-900 mb-4">Filter Available Slots</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-barn-700 mb-2">Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-barn-700 mb-2">Lesson Type</label>
              <select
                value={selectedLessonType}
                onChange={(e) => setSelectedLessonType(e.target.value)}
                className="w-full px-3 py-2 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500"
              >
                <option value="">All Lesson Types</option>
                {lessonTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name} (${type.price})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Available Slots */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-barn-900">Available Time Slots</h2>
            <button
              onClick={loadAvailableSlots}
              disabled={isLoadingSlots}
              className="btn btn-outline"
            >
              {isLoadingSlots ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {isLoadingSlots ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-copper-600 mx-auto mb-4"></div>
              <p className="text-barn-700">Loading available slots...</p>
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-barn-400 mx-auto mb-4" />
              <p className="text-barn-700">No available slots found for the selected criteria.</p>
              <p className="text-sm text-barn-600 mt-2">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSlots.map((slot) => (
                <div key={slot.id} className="border border-butter-300 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-barn-900">
                      {formatDate(slot.date)}
                    </span>
                    <span className="text-sm text-barn-600">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-barn-400" />
                      <span className="text-sm text-barn-700">
                        {slot.instructor ? `${slot.instructor.firstName} ${slot.instructor.lastName}` : 'Instructor TBD'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-barn-400" />
                      <span className="text-sm text-barn-700">{slot.horse ? slot.horse.name : 'Horse TBD'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-barn-400" />
                      <span className="text-sm text-barn-700">
                        {slot.lessonType ? `${slot.lessonType.name} ($${slot.lessonType.price})` : 'Lesson Type TBD'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedSlot(slot)}
                    className="w-full btn btn-primary"
                  >
                    Book This Slot
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Confirmation Modal */}
      {selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-barn-900 mb-4">Confirm Booking</h3>
            
            <div className="space-y-3 mb-6">
              <div>
                <span className="font-medium text-barn-700">Date:</span>
                <p className="text-barn-900">{formatDate(selectedSlot.date)}</p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Time:</span>
                <p className="text-barn-900">{formatTime(selectedSlot.startTime)} - {formatTime(selectedSlot.endTime)}</p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Instructor:</span>
                <p className="text-barn-900">
                  {selectedSlot.instructor ? `${selectedSlot.instructor.firstName} ${selectedSlot.instructor.lastName}` : 'Instructor TBD'}
                </p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Horse:</span>
                <p className="text-barn-900">{selectedSlot.horse ? selectedSlot.horse.name : 'Horse TBD'}</p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Lesson Type:</span>
                <p className="text-barn-900">{selectedSlot.lessonType ? selectedSlot.lessonType.name : 'Lesson Type TBD'}</p>
              </div>
              <div>
                <span className="font-medium text-barn-700">Price:</span>
                <p className="text-barn-900">${selectedSlot.lessonType ? selectedSlot.lessonType.price : 'TBD'}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSlot(null)}
                className="flex-1 btn btn-outline"
                disabled={isBooking}
              >
                Cancel
              </button>
              <button
                onClick={() => handleBookLesson(selectedSlot)}
                disabled={isBooking}
                className="flex-1 btn btn-primary"
              >
                {isBooking ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
