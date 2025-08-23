import apiClient from './api';

export interface ActivityData {
  action?: string;
  details?: Record<string, any>;
  page?: string;
  timeoutMinutes?: number;
  warningMinutes?: number;
  newTimeoutMinutes?: number;
}

export class ActivityLogger {
  static async logPageView(page: string) {
    try {
      await apiClient.activity.pageView({ page });
    } catch (error) {
      console.error('Failed to log page view:', error);
      // Don't throw to avoid breaking main functionality
    }
  }

  static async logAction(action: string, details?: Record<string, any>) {
    try {
      await apiClient.activity.action({ action, details });
    } catch (error) {
      console.error('Failed to log action:', error);
      // Don't throw to avoid breaking main functionality
    }
  }

  static async logSessionTimeout(timeoutMinutes: number) {
    try {
      await apiClient.activity.sessionTimeout({ timeoutMinutes });
    } catch (error) {
      console.error('Failed to log session timeout:', error);
      // Don't throw to avoid breaking main functionality
    }
  }

  static async logSessionExtended(newTimeoutMinutes: number) {
    try {
      await apiClient.activity.sessionExtended({ newTimeoutMinutes });
    } catch (error) {
      console.error('Failed to log session extension:', error);
      // Don't throw to avoid breaking main functionality
    }
  }

  static async logSessionWarning(warningMinutes: number) {
    try {
      await apiClient.activity.sessionWarning({ warningMinutes });
    } catch (error) {
      console.error('Failed to log session warning:', error);
      // Don't throw to avoid breaking main functionality
    }
  }

  static async getActivityHistory(limit: number = 50) {
    try {
      const response = await apiClient.activity.history({ limit });
      return response.data;
    } catch (error) {
      console.error('Failed to get activity history:', error);
      return { activities: [], total: 0 };
    }
  }

  static async getActivitySummary(days: number = 30) {
    try {
      const response = await apiClient.activity.summary({ days });
      return response.data.summary;
    } catch (error) {
      console.error('Failed to get activity summary:', error);
      return {
        totalActivities: 0,
        loginCount: 0,
        pageViews: 0,
        actions: 0,
        sessionTimeouts: 0,
        sessionExtensions: 0,
        lastActivity: null,
        activityByDay: {}
      };
    }
  }

  // Auto-log page views when component mounts
  static logCurrentPage() {
    if (typeof window !== 'undefined') {
      const page = window.location.pathname;
      this.logPageView(page);
    }
  }

  // Log navigation actions
  static logNavigation(from: string, to: string) {
    this.logAction('navigation', { from, to });
  }

  // Log form submissions
  static logFormSubmission(formName: string, success: boolean, details?: Record<string, any>) {
    this.logAction('form_submission', {
      formName,
      success,
      ...details
    });
  }

  // Log button clicks
  static logButtonClick(buttonName: string, context?: string) {
    this.logAction('button_click', {
      buttonName,
      context
    });
  }

  // Log data operations
  static logDataOperation(operation: 'create' | 'read' | 'update' | 'delete', entity: string, success: boolean, details?: Record<string, any>) {
    this.logAction('data_operation', {
      operation,
      entity,
      success,
      ...details
    });
  }
}

// Auto-log page views on route changes
if (typeof window !== 'undefined') {
  let currentPath = window.location.pathname;
  
  // Log initial page view
  ActivityLogger.logPageView(currentPath);
  
  // Listen for route changes (for Next.js)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      ActivityLogger.logNavigation(currentPath, newPath);
      ActivityLogger.logPageView(newPath);
      currentPath = newPath;
    }
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      ActivityLogger.logNavigation(currentPath, newPath);
      ActivityLogger.logPageView(newPath);
      currentPath = newPath;
    }
  };
  
  // Listen for popstate events
  window.addEventListener('popstate', () => {
    const newPath = window.location.pathname;
    if (newPath !== currentPath) {
      ActivityLogger.logNavigation(currentPath, newPath);
      ActivityLogger.logPageView(newPath);
      currentPath = newPath;
    }
  });
}

export default ActivityLogger;
