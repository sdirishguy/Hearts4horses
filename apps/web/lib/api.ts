import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api/v1', // Use relative URL to work with Next.js rewrite
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiClient = {
  // Auth endpoints
  auth: {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    me: () => api.get('/auth/me'),
  },

  // Public endpoints
  public: {
    services: () => api.get('/public/services'),
    horses: () => api.get('/public/horses'),
  },

  // User endpoints
  user: {
    notifications: () => api.get('/user/notifications'),
    announcements: () => api.get('/user/announcements'),
    markNotificationRead: (id: string) => api.put(`/user/notifications/${id}/read`),
    markAnnouncementRead: (id: string) => api.put(`/user/announcements/${id}/read`),
  },

  // Student endpoints
  student: {
    slots: (params?: any) => api.get('/student/slots', { params }),
    getAvailableSlots: (params?: any) => api.get('/student/slots', { params }),
    bookings: () => api.get('/student/bookings'),
    createBooking: (data: any) => api.post('/student/bookings', data),
    bookLesson: (data: any) => api.post('/student/bookings', data),
    cancelBooking: (id: string) => api.delete(`/student/bookings/${id}`),
  },

  // Admin endpoints
  admin: {
    announcements: () => api.get('/admin/announcements'),
    createAnnouncement: (data: any) => api.post('/admin/announcements', data),
    updateAnnouncement: (id: string, data: any) => api.put(`/admin/announcements/${id}`, data),
    deleteAnnouncement: (id: string) => api.delete(`/admin/announcements/${id}`),
    // Horse management
    getHorses: () => api.get('/admin/horses'),
    createHorse: (data: any) => api.post('/admin/horses', data),
    updateHorse: (id: string, data: any) => api.put(`/admin/horses/${id}`, data),
    deleteHorse: (id: string) => api.delete(`/admin/horses/${id}`),
  },

  // Activity endpoints
  activity: {
    pageView: (data: { page: string }) => api.post('/activity/page-view', data),
    action: (data: { action: string; details?: Record<string, any> }) => api.post('/activity/action', data),
    sessionTimeout: (data: { timeoutMinutes: number }) => api.post('/activity/session-timeout', data),
    sessionExtended: (data: { newTimeoutMinutes: number }) => api.post('/activity/session-extended', data),
    sessionWarning: (data: { warningMinutes: number }) => api.post('/activity/session-warning', data),
    history: (params: { limit?: number }) => api.get('/activity/history', { params }),
    summary: (params: { days?: number }) => api.get('/activity/summary', { params }),
  },
};

export default apiClient;
