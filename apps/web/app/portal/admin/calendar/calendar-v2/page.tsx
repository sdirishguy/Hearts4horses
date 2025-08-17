'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Calendar,
  Clock,
  Settings,
  Plus,
  Edit,
  Trash2,
  Bell,
  ArrowLeft,
  ArrowRight,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';

interface CalendarSettings {
  workingDays: number[]; // 0-6 (Sunday-Saturday)
  startTime: string; // "08:00"
  endTime: string; // "18:00"
  timeIncrement: 15 | 30 | 60; // minutes
  timeSlots: string[]; // ["08:00", "08:15", "08:30", ...]
}

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  type: 'lesson' | 'event' | 'reminder';
  blocksTime: boolean; // whether this event blocks lesson scheduling
  reminderTime?: string; // when to show reminder
  isReminderShown: boolean;
}

interface TimeSlot {
  time: string;
  isAvailable: boolean;
  events: CalendarEvent[];
}

export default function AdvancedCalendar() {
  const { user, userType, isLoading, isAuthenticated, logout } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [settings, setSettings] = useState<CalendarSettings>({
    workingDays: [1, 2, 3, 4, 5], // Monday-Friday
    startTime: "08:00",
    endTime: "18:00",
    timeIncrement: 30,
    timeSlots: ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"]
  });
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'admin')) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, userType, isLoading]);

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      loadSettings();
      loadEvents();
    }
  }, [isAuthenticated, userType]);

  useEffect(() => {
    if (settings.startTime && settings.endTime && settings.timeIncrement) {
      generateTimeSlots();
    }
  }, [settings.startTime, settings.endTime, settings.timeIncrement]);

  const generateTimeSlots = () => {
    const slots: string[] = [];
    const start = new Date(`2000-01-01T${settings.startTime}`);
    const end = new Date(`2000-01-01T${settings.endTime}`);
    
    let current = new Date(start);
    while (current < end) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + settings.timeIncrement);
    }
    
    setSettings(prev => ({ ...prev, timeSlots: slots }));
  };

  const generateTimeSlotsFromSettings = (settingsData: CalendarSettings) => {
    const slots: string[] = [];
    const start = new Date(`2000-01-01T${settingsData.startTime}`);
    const end = new Date(`2000-01-01T${settingsData.endTime}`);
    
    let current = new Date(start);
    while (current < end) {
      slots.push(current.toTimeString().slice(0, 5));
      current.setMinutes(current.getMinutes() + settingsData.timeIncrement);
    }
    
    console.log('Generated time slots:', slots);
    setSettings(prev => ({ ...prev, timeSlots: slots }));
  };

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/v1/admin/calendar-settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        const newSettings = data.settings;
        console.log('Loaded settings:', newSettings);
        setSettings(newSettings);
        
        // Generate time slots after loading settings
        if (newSettings.startTime && newSettings.endTime && newSettings.timeIncrement) {
          console.log('Generating time slots with settings:', newSettings);
          generateTimeSlotsFromSettings(newSettings);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/v1/admin/calendar-events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const saveSettings = async (newSettings: CalendarSettings) => {
    try {
      const response = await fetch('/api/v1/admin/calendar-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(newSettings)
      });

      if (response.ok) {
        setSettings(newSettings);
        // Regenerate time slots with new settings
        generateTimeSlotsFromSettings(newSettings);
        setShowSettingsModal(false);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const addEvent = async (eventData: Omit<CalendarEvent, 'id' | 'isReminderShown'>) => {
    try {
      const response = await fetch('/api/v1/admin/calendar-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(eventData)
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents([...events, newEvent.data]);
        setShowAddEventModal(false);
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getEventsForDateAndTime = (date: string, time: string) => {
    return events.filter(event => 
      event.date === date && 
      event.startTime <= time && 
      event.endTime > time
    );
  };

  const isWorkingDay = (date: Date) => {
    return settings.workingDays.includes(date.getDay());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'daily') {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    }
    setCurrentDate(newDate);
  };

  if (isLoading) {
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

  console.log('Current settings state:', settings);
  console.log('Current events state:', events);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-4">
                <Link
                  href="/portal/admin"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Admin Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Advanced Calendar</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your schedule, events, and lesson availability
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </button>
              <button
                onClick={() => setShowAddEventModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </button>
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

      {/* Calendar Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateDate('prev')}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl font-semibold text-gray-900">
                {viewMode === 'daily' 
                  ? currentDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })
                  : `${getWeekDays()[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${getWeekDays()[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                }
              </h2>
              
              <button
                onClick={() => navigateDate('next')}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('daily')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'daily'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  viewMode === 'weekly'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Weekly
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {viewMode === 'daily' ? (
            <DailyView 
              date={currentDate}
              timeSlots={settings.timeSlots}
              events={events}
              onSlotClick={(time) => setSelectedSlot({ date: currentDate.toISOString().split('T')[0], time })}
            />
          ) : (
            <WeeklyView 
              weekDays={getWeekDays()}
              timeSlots={settings.timeSlots}
              events={events}
              workingDays={settings.workingDays}
              onSlotClick={(date, time) => setSelectedSlot({ date, time })}
            />
          )}
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal 
          settings={settings}
          onSave={saveSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <AddEventModal 
          selectedSlot={selectedSlot}
          onAdd={addEvent}
          onClose={() => setShowAddEventModal(false)}
        />
      )}
    </div>
  );
}

// Daily View Component
function DailyView({ 
  date, 
  timeSlots, 
  events, 
  onSlotClick 
}: { 
  date: Date; 
  timeSlots: string[]; 
  events: CalendarEvent[]; 
  onSlotClick: (time: string) => void;
}) {
  const dateString = date.toISOString().split('T')[0];
  
  return (
    <div className="grid grid-cols-1">
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
        <h3 className="text-lg font-medium text-gray-900">
          {date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
      </div>
      
      <div className="divide-y divide-gray-200">
        {timeSlots.map((time) => {
          const slotEvents = events.filter(event => 
            event.date === dateString && 
            event.startTime <= time && 
            event.endTime > time
          );
          
          return (
            <div 
              key={time}
              className="px-6 py-3 hover:bg-gray-50 cursor-pointer"
              onClick={() => onSlotClick(time)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 text-sm font-medium text-gray-500">
                    {formatTime(time)}
                  </div>
                  <div className="flex-1">
                    {slotEvents.length > 0 ? (
                      slotEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={`inline-block px-2 py-1 rounded text-xs font-medium mr-2 ${
                            event.type === 'lesson' 
                              ? 'bg-blue-100 text-blue-800'
                              : event.type === 'event'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {event.title}
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Available</span>
                    )}
                  </div>
                </div>
                <MoreHorizontal className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Weekly View Component
function WeeklyView({ 
  weekDays, 
  timeSlots, 
  events, 
  workingDays, 
  onSlotClick 
}: { 
  weekDays: Date[]; 
  timeSlots: string[]; 
  events: CalendarEvent[]; 
  workingDays: number[]; 
  onSlotClick: (date: string, time: string) => void;
}) {
  return (
    <div className="grid grid-cols-8">
      {/* Time column */}
      <div className="border-r border-gray-200 bg-gray-50">
        <div className="h-12"></div> {/* Header spacer */}
        {timeSlots.map((time) => (
          <div key={time} className="h-12 border-b border-gray-200 px-3 py-2">
            <div className="text-xs font-medium text-gray-500">
              {formatTime(time)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Day columns */}
      {weekDays.map((day) => {
        const dateString = day.toISOString().split('T')[0];
        const isWorking = workingDays.includes(day.getDay());
        
        return (
          <div key={dateString} className="border-r border-gray-200 last:border-r-0">
            {/* Day header */}
            <div className={`h-12 border-b border-gray-200 px-3 py-2 ${
              isWorking ? 'bg-white' : 'bg-gray-100'
            }`}>
              <div className="text-sm font-medium text-gray-900">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-xs text-gray-500">
                {day.getDate()}
              </div>
            </div>
            
            {/* Time slots */}
            {timeSlots.map((time) => {
              const slotEvents = events.filter(event => 
                event.date === dateString && 
                event.startTime <= time && 
                event.endTime > time
              );
              
              return (
                <div 
                  key={time}
                  className={`h-12 border-b border-gray-200 px-2 py-1 cursor-pointer ${
                    isWorking ? 'hover:bg-gray-50' : 'bg-gray-50'
                  }`}
                  onClick={() => onSlotClick(dateString, time)}
                >
                  {slotEvents.length > 0 && (
                    <div className="text-xs">
                      {slotEvents.map((event) => (
                        <div 
                          key={event.id}
                          className={`px-1 py-0.5 rounded text-xs font-medium mb-1 truncate ${
                            event.type === 'lesson' 
                              ? 'bg-blue-100 text-blue-800'
                              : event.type === 'event'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Settings Modal Component
function SettingsModal({ 
  settings, 
  onSave, 
  onClose 
}: { 
  settings: CalendarSettings; 
  onSave: (settings: CalendarSettings) => void; 
  onClose: () => void;
}) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(localSettings);
  };

  const toggleWorkingDay = (day: number) => {
    setLocalSettings(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Calendar Settings</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
              <div className="grid grid-cols-7 gap-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWorkingDay(index)}
                    className={`p-2 text-xs font-medium rounded ${
                      localSettings.workingDays.includes(index)
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={localSettings.startTime}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, startTime: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={localSettings.endTime}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, endTime: e.target.value }))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Time Increment</label>
              <select
                value={localSettings.timeIncrement}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, timeIncrement: parseInt(e.target.value) as 15 | 30 | 60 }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Add Event Modal Component
function AddEventModal({ 
  selectedSlot, 
  onAdd, 
  onClose 
}: { 
  selectedSlot: { date: string; time: string } | null; 
  onAdd: (event: Omit<CalendarEvent, 'id' | 'isReminderShown'>) => void; 
  onClose: () => void;
}) {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    startTime: selectedSlot?.time || '',
    endTime: '',
    date: selectedSlot?.date || '',
    type: 'event' as 'lesson' | 'event' | 'reminder',
    blocksTime: true,
    reminderTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(eventData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add Event</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={eventData.description}
                onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time *</label>
                <input
                  type="time"
                  value={eventData.startTime}
                  onChange={(e) => setEventData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time *</label>
                <input
                  type="time"
                  value={eventData.endTime}
                  onChange={(e) => setEventData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                value={eventData.date}
                onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Type</label>
              <select
                value={eventData.type}
                onChange={(e) => setEventData(prev => ({ ...prev, type: e.target.value as 'lesson' | 'event' | 'reminder' }))}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="event">Event</option>
                <option value="lesson">Lesson</option>
                <option value="reminder">Reminder</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="blocksTime"
                checked={eventData.blocksTime}
                onChange={(e) => setEventData(prev => ({ ...prev, blocksTime: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="blocksTime" className="ml-2 block text-sm text-gray-900">
                Block time for lessons
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function for formatting time
function formatTime(time: string) {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}
