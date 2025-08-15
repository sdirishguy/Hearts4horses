'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterData } from '@/lib/auth';
import { Eye, EyeOff, Mail, Lock, User, Phone, Calendar, BookOpen, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    userType: 'student',
    dateOfBirth: '',
    experienceLevel: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData);
      router.push('/portal/student');
    } catch (error: any) {
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-butter-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-barn-900">
            Join Hearts4Horses
          </h2>
          <p className="mt-2 text-barn-700">
            Create your account to start your equestrian journey
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* User Type Selection */}
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-barn-700 mb-2">
                I am a...
              </label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
              >
                <option value="student">Student (taking lessons)</option>
                <option value="guardian">Guardian (parent/guardian)</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-barn-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-barn-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900 placeholder-barn-400"
                    placeholder="First name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-barn-700 mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900 placeholder-barn-400"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-barn-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-barn-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900 placeholder-barn-400"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-barn-700 mb-2">
                Phone Number (optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-barn-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900 placeholder-barn-400"
                  placeholder="Phone number"
                />
              </div>
            </div>

            {/* Student-specific fields */}
            {formData.userType === 'student' && (
              <>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-barn-700 mb-2">
                    Date of Birth (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-barn-400" />
                    </div>
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="experienceLevel" className="block text-sm font-medium text-barn-700 mb-2">
                    Experience Level (optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-barn-400" />
                    </div>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                    >
                      <option value="">Select experience level</option>
                      <option value="beginner">Beginner (no experience)</option>
                      <option value="novice">Novice (some experience)</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-barn-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-barn-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900 placeholder-barn-400"
                  placeholder="Create a password (min 8 characters)"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-barn-400 hover:text-barn-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-barn-400 hover:text-barn-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-copper-600 hover:bg-copper-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-copper-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : (
                <div className="flex items-center">
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-barn-600">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-medium text-copper-600 hover:text-copper-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link 
            href="/" 
            className="text-sm text-barn-600 hover:text-barn-500 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
