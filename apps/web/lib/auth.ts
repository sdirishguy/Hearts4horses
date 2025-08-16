import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  userId: string;
  dateOfBirth?: string;
  experienceLevel?: string;
  notes?: string;
  user: User;
  guardianStudents: any[];
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  userType: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'student' | 'guardian' | 'instructor';
  dateOfBirth?: string;
  experienceLevel?: string;
}

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  // Get current user
  getCurrentUser: async (): Promise<{ user: User; userType: string }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Logout (client-side only)
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    }
  },
};

// Student API functions
export const studentAPI = {
  // Get student profile
  getProfile: async (): Promise<{ data: Student }> => {
    const response = await api.get('/student/profile');
    return response.data;
  },

  // Get available slots
  getSlots: async (params?: { date?: string; lessonTypeId?: string }) => {
    const response = await api.get('/student/slots', { params });
    return response.data;
  },

  // Get available slots (alias for getSlots)
  getAvailableSlots: async (params?: { date?: string; lessonTypeId?: string }) => {
    const response = await api.get('/student/slots', { params });
    return response.data;
  },

  // Book a lesson
  bookLesson: async (data: { 
    slotId: string; 
    lessonTypeId: string;
    horseId: string;
    instructorId: string;
    date: string;
    startTime: string;
    endTime: string;
    paymentSource: string;
    notes?: string 
  }) => {
    const response = await api.post('/student/bookings', data);
    return response.data;
  },

  // Get student's bookings
  getBookings: async (params?: { status?: string }) => {
    const response = await api.get('/student/bookings', { params });
    return response.data;
  },

  // Cancel a booking
  cancelBooking: async (bookingId: string) => {
    const response = await api.patch(`/student/bookings/${bookingId}/cancel`);
    return response.data;
  },

  // Get student's packages
  getPackages: async () => {
    const response = await api.get('/student/packages');
    return response.data;
  },

  // Get available packages for purchase
  getAvailablePackages: async () => {
    const response = await api.get('/student/packages/available');
    return response.data;
  },

  // Purchase a package
  purchasePackage: async (data: { packageId: string; paymentSource: string }) => {
    const response = await api.post('/student/packages/purchase', data);
    return response.data;
  },

  // Get student's progress
  getProgress: async () => {
    const response = await api.get('/student/progress');
    return response.data;
  },

  // Get progress statistics
  getProgressStats: async () => {
    const response = await api.get('/student/progress/stats');
    return response.data;
  },

  // Get lesson types
  getLessonTypes: async () => {
    const response = await api.get('/student/lesson-types');
    return response.data;
  },
};

// Public API functions
export const publicAPI = {
  // Get horses
  getHorses: async () => {
    const response = await api.get('/public/horses');
    return response.data;
  },

  // Get services
  getServices: async () => {
    const response = await api.get('/public/services');
    return response.data;
  },

  // Get testimonials
  getTestimonials: async () => {
    const response = await api.get('/public/testimonials');
    return response.data;
  },
};

// Token management utilities
export const tokenUtils = {
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  },
};

// User management utilities
export const userUtils = {
  setUser: (user: User, userType: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', userType);
    }
  },

  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },

  getUserType: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userType');
    }
    return null;
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
    }
  },
};

export default api;
