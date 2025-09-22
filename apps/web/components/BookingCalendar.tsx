'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { Calendar, Clock, Users, User } from 'lucide-react';
import apiClient from '@/lib/api';

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  instructor: { firstName: string; lastName: string };
  lessonType: { name: string; priceCents: number };
  horse?: { id: string; name: string };
  available: boolean;
}

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const weekStart = startOfWeek(selectedDate);
  const weekEnd = endOfWeek(selectedDate);
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  useEffect(() => {
    loadSlots();
  }, [selectedDate]);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const response = await apiClient.student.getAvailableSlots({
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString()
      });
      setSlots(response.data);
    } catch (error) {
      console.error('Failed to load slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    try {
      await apiClient.student.bookLesson({
        slotId: selectedSlot.id,
        notes: ''
      });
      alert('Booking successful!');
      loadSlots();
      setSelectedSlot(null);
    } catch (error) {
      alert('Booking failed. Please try again.');
    }
  };

  const getSlotsForDay = (date: Date) => {
    return slots.filter(slot => 
      isSameDay(new Date(slot.date), date)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Book a Lesson
        </h2>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDays.map((day) => {
          const daySlots = getSlotsForDay(day);
          const hasSlots = daySlots.length > 0;

          return (
            <div
              key={day.toISOString()}
              className={`border rounded-lg p-2 cursor-pointer transition ${
                isSameDay(day, selectedDate)
                  ? 'border-copper bg-copper/10'
                  : hasSlots
                  ? 'border-gray-300 hover:border-copper'
                  : 'border-gray-200 opacity-50'
              }`}
              onClick={() => hasSlots && setSelectedDate(day)}
            >
              <div className="text-center">
                <div className="text-xs text-gray-600">
                  {format(day, 'EEE')}
                </div>
                <div className="text-lg font-semibold">
                  {format(day, 'd')}
                </div>
                {hasSlots && (
                  <div className="text-xs text-copper mt-1">
                    {daySlots.length} slots
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Time Slots */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          getSlotsForDay(selectedDate).map((slot) => (
            <div
              key={slot.id}
              className={`border rounded-lg p-4 cursor-pointer transition ${
                selectedSlot?.id === slot.id
                  ? 'border-copper bg-copper/10'
                  : 'border-gray-200 hover:border-copper'
              }`}
              onClick={() => setSelectedSlot(slot)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4" />
                    {format(new Date(slot.startTime), 'h:mm a')} - 
                    {format(new Date(slot.endTime), 'h:mm a')}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {slot.lessonType.name} - ${(slot.lessonType.priceCents / 100).toFixed(2)}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {slot.instructor.firstName} {slot.instructor.lastName}
                    </span>
                    {slot.horse && (
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {slot.horse.name}
                      </span>
                    )}
                  </div>
                </div>
                {!slot.available && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                    Full
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Book Button */}
      {selectedSlot && (
        <div className="mt-6">
          <button
            onClick={handleBooking}
            className="w-full bg-copper text-white py-3 rounded-lg font-semibold hover:bg-copper/90 transition"
          >
            Book This Lesson
          </button>
        </div>
      )}
    </div>
  );
}