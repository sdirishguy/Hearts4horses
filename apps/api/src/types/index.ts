// User and Authentication
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  roles: Role[];
}

export interface Role {
  id: number;
  key: 'owner' | 'manager' | 'instructor' | 'staff' | 'student' | 'guardian';
}

export interface Student {
  id: string;
  userId: string;
  dateOfBirth?: Date;
  experienceLevel?: string;
  notes?: string;
  user: User;
}

export interface Guardian {
  id: string;
  userId: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  user: User;
}

// Horses
export interface Horse {
  id: string;
  name: string;
  breed?: string;
  dob?: Date;
  sex?: string;
  temperament?: 'calm' | 'spirited' | 'green' | 'steady';
  weight?: number;
  height?: number;
  bio?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Lessons and Scheduling
export interface LessonType {
  id: string;
  name: string;
  durationMinutes: number;
  priceCents: number;
  maxStudents: number;
  requiresHorse: boolean;
}

export interface AvailabilitySlot {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  instructorId?: string;
  lessonTypeId: string;
  capacity: number;
  horseId?: string;
  status: 'open' | 'held' | 'booked' | 'closed';
  lessonType: LessonType;
  instructor?: User;
  horse?: Horse;
}

export interface LessonBooking {
  id: string;
  slotId: string;
  studentId: string;
  status: 'booked' | 'completed' | 'cancelled' | 'no_show';
  paymentSource: string;
  stripePaymentId?: string;
  notes?: string;
  createdAt: Date;
  slot: AvailabilitySlot;
  student: Student;
}

export interface StudentPackage {
  id: string;
  studentId: string;
  lessonTypeId: string;
  lessonsIncluded: number;
  remainingLessons: number;
  expiresAt?: Date;
  stripePaymentId?: string;
  status: 'active' | 'expired' | 'used';
  student: Student;
  lessonType: LessonType;
}

// E-commerce
export interface Product {
  id: string;
  name: string;
  slug: string;
  type: 'merch' | 'digital' | 'gift_card';
  priceCents: number;
  stockQty?: number;
  description: string;
  media: string[];
}

export interface Order {
  id: string;
  userId: string;
  status: 'pending' | 'paid' | 'fulfilled' | 'cancelled';
  subtotalCents: number;
  taxCents: number;
  shippingCents: number;
  totalCents: number;
  stripeCheckoutId?: string;
  createdAt: Date;
  user: User;
}

// Content and Media
export interface MediaAsset {
  id: string;
  ownerUserId?: string;
  kind: 'image' | 'video';
  url: string;
  altText?: string;
  source: 'upload' | 'instagram' | 'facebook';
  publishedAt: Date;
}

export interface Testimonial {
  id: string;
  authorName: string;
  photoUrl?: string;
  quote: string;
  approvedByUserId?: string;
  isPublished: boolean;
  createdAt: Date;
}

// Forms
export interface FormTemplate {
  id: string;
  key: 'liability_waiver' | 'photo_release' | 'intake';
  title: string;
  schemaJson: any;
  renderVersion: number;
}

export interface FormSubmission {
  id: string;
  formTemplateId: string;
  userId?: string;
  studentId?: string;
  dataJson: any;
  signedPdfUrl?: string;
  signatureBlob?: string;
  signedAt?: Date;
  ipAddress: string;
  createdAt: Date;
}

// Events
export interface Event {
  id: string;
  name: string;
  description: string;
  location?: string;
  startAt: Date;
  endAt: Date;
  capacity?: number;
  priceCents?: number;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Weather
export interface WeatherForecast {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
  description: string;
}

// Stripe
export interface StripeCheckoutSession {
  id: string;
  url: string;
  amount_total: number;
  currency: string;
  metadata: Record<string, string>;
}
