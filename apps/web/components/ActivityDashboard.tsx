'use client';

import { useState, useEffect } from 'react';
import { ActivityLogger } from '@/lib/activityLogger';
import { Calendar, Clock, MousePointer, Eye, AlertTriangle, RefreshCw, TrendingUp, BarChart3 } from 'lucide-react';

interface Activity {
  id: string;
  activityType: string;
  description: string;
  metadata: any;
  createdAt: string;
}

interface ActivitySummary {
  totalActivities: number;
  loginCount: number;
  pageViews: number;
  actions: number;
  sessionTimeouts: number;
  sessionExtensions: number;
  lastActivity: string | null;
  activityByDay: Record<string, number>;
}

export default function ActivityDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    loadActivityData();
  }, [selectedPeriod]);

  const loadActivityData = async () => {
    setIsLoading(true);
    try {
      const [activityData, summaryData] = await Promise.all([
        ActivityLogger.getActivityHistory(50),
        ActivityLogger.getActivitySummary(selectedPeriod)
      ]);
      
      setActivities(activityData.activities || []);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load activity data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'login':
        return <Clock className="h-4 w-4 text-green-600" />;
      case 'logout':
        return <Clock className="h-4 w-4 text-red-600" />;
      case 'page_view':
        return <Eye className="h-4 w-4 text-blue-600" />;
      case 'action':
        return <MousePointer className="h-4 w-4 text-purple-600" />;
      case 'session_timeout':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'session_extended':
        return <RefreshCw className="h-4 w-4 text-green-600" />;
      case 'session_warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Activities</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.totalActivities}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Logins</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.loginCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Page Views</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.pageViews}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <MousePointer className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Actions</p>
                <p className="text-2xl font-semibold text-gray-900">{summary.actions}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Activity History</h3>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={loadActivityData}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No activity recorded yet</p>
            </div>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.activityType)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(activity.createdAt)} • {formatRelativeTime(activity.createdAt)}
                  </p>
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-1 text-xs text-gray-600">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <span key={key} className="inline-block mr-2">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Activity Chart (Simple) */}
        {summary && summary.activityByDay && Object.keys(summary.activityByDay).length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Activity by Day</h4>
            <div className="flex items-end space-x-1 h-32">
              {Object.entries(summary.activityByDay)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                .map(([date, count]) => {
                  const maxCount = Math.max(...Object.values(summary.activityByDay));
                  const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  return (
                    <div key={date} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
