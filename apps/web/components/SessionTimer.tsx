'use client';

import { useState, useEffect, useCallback } from 'react';
import { Clock, AlertTriangle, X, Settings, LogOut } from 'lucide-react';
import ActivityLogger from '@/lib/activityLogger';

interface SessionTimerProps {
  onLogout: () => void;
  onExtendSession: () => void;
  showSettings: boolean;
  onShowSettings: (show: boolean) => void;
}

interface SessionSettings {
  timeoutMinutes: number;
  warningMinutes: number;
}

const SESSION_TIMEOUT_OPTIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 120, label: '2 hours' },
];

export default function SessionTimer({ onLogout, onExtendSession, showSettings, onShowSettings }: SessionTimerProps) {
  const [settings, setSettings] = useState<SessionSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sessionSettings');
      return saved ? JSON.parse(saved) : { timeoutMinutes: 30, warningMinutes: 5 };
    }
    return { timeoutMinutes: 30, warningMinutes: 5 };
  });

  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Save settings to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionSettings', JSON.stringify(settings));
    }
  }, [settings]);

  // Update last activity on user interaction
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Set up activity listeners
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [updateActivity]);

  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      const timeoutMs = settings.timeoutMinutes * 60 * 1000;
      const warningMs = (settings.timeoutMinutes - settings.warningMinutes) * 60 * 1000;

      if (timeSinceActivity >= timeoutMs) {
        // Session expired
        ActivityLogger.logSessionTimeout(settings.timeoutMinutes);
        onLogout();
      } else if (timeSinceActivity >= warningMs && !showWarning) {
        // Show warning
        ActivityLogger.logSessionWarning(settings.warningMinutes);
        setShowWarning(true);
        setTimeLeft(Math.ceil((timeoutMs - timeSinceActivity) / 1000));
      } else if (showWarning) {
        // Update countdown
        setTimeLeft(Math.ceil((timeoutMs - timeSinceActivity) / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, settings, showWarning, onLogout]);

  const handleExtendSession = () => {
    setLastActivity(Date.now());
    setShowWarning(false);
    ActivityLogger.logSessionExtended(settings.timeoutMinutes);
    onExtendSession();
  };

  const handleLogout = () => {
    setShowWarning(false);
    onLogout();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render the floating button - we'll handle this in the parent component
  if (!showWarning && !showSettings) {
    return null;
  }

  return (
    <>
      {/* Session Warning Dialog */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Session Expiring Soon
                </h3>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-gray-600">
                  Your session will expire in {formatTime(timeLeft)} due to inactivity.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Logout Now
                </button>
                <button
                  onClick={handleExtendSession}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Extend Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Dialog */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Session Settings
                </h3>
              </div>
              <button
                onClick={() => onShowSettings(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout
                  </label>
                  <select
                    value={settings.timeoutMinutes}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      timeoutMinutes: parseInt(e.target.value)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {SESSION_TIMEOUT_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warning Time (minutes before expiry)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={settings.timeoutMinutes - 1}
                    value={settings.warningMinutes}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      warningMinutes: Math.min(parseInt(e.target.value), prev.timeoutMinutes - 1)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => onShowSettings(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
