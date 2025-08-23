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
  student?: Student;
  guardianStudents?: GuardianStudent[];
}

export interface GuardianStudent {
  guardianId: string;
  studentId: string;
  relationship?: string;
  guardian: {
    id: string;
    userId: string;
    emergencyContactName?: string;
    emergencyContactPhone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    user?: User;
  };
}

export interface Student {
  id: string;
  userId: string;
  dateOfBirth?: string;
  experienceLevel?: string;
  notes?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  profilePictureUrl?: string;
  user: User;
  guardianStudents: any[];
}

export interface UserRole {
  id: number;
  key: string;
  name: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
  userType: string;
  roles: UserRole[];
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
  
  // Student-specific fields
  dateOfBirth?: string;
  experienceLevel?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  
  // Guardian-specific fields (for student registrations)
  guardianFirstName?: string;
  guardianLastName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianRelationship?: string;
  guardianAddress?: string;
  guardianCity?: string;
  guardianState?: string;
  guardianZipCode?: string;
  
  // Profile picture
  profilePicture?: File;
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
  getCurrentUser: async (): Promise<{ user: User; userType: string; roles: UserRole[] }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ message: string }> => {
    const response = await api.put('/user/profile', data);
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
      // Store in localStorage for client-side access (temporary during transition)
      localStorage.setItem('authToken', token);
      
      // Set HttpOnly cookie for server-side access
      // Note: HttpOnly cookies can only be set by the server
      // For now, we'll use a regular cookie that middleware can read
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const cookieOptions = [
        `h4h_session=${token}`,
        'path=/',
        `max-age=${7 * 24 * 60 * 60}`,
        'SameSite=Strict'
      ];
      
      if (!isLocalhost) {
        cookieOptions.push('Secure');
      }
      
      document.cookie = cookieOptions.join('; ');
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
      // Remove the cookie
      document.cookie = 'h4h_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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
  setUser: (user: User, userType: string, roles?: any[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userType', userType);
      if (roles) {
        localStorage.setItem('userRoles', JSON.stringify(roles));
      }
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

  getUserRoles: (): any[] => {
    if (typeof window !== 'undefined') {
      const rolesStr = localStorage.getItem('userRoles');
      return rolesStr ? JSON.parse(rolesStr) : [];
    }
    return [];
  },

  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      localStorage.removeItem('userRoles');
    }
  },
};

export default api;
