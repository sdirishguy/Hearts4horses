'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/auth';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  BookOpen, 
  Save, 
  ArrowLeft,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface StudentData {
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
  profilePictureUrl?: string;
}

interface GuardianData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  relationship?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export default function UserProfilePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [studentData, setStudentData] = useState<StudentData>({});
  const [guardianData, setGuardianData] = useState<GuardianData>({});
  const [isLoadingStudentData, setIsLoadingStudentData] = useState(false);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (user) {
      setProfileData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
      }));

      // Load student and guardian data if user is a student
      if (user.student) {
        setStudentData({
          dateOfBirth: user.student.dateOfBirth ? new Date(user.student.dateOfBirth).toISOString().split('T')[0] : '',
          experienceLevel: user.student.experienceLevel || '',
          emergencyContactName: user.student.emergencyContactName || '',
          emergencyContactPhone: user.student.emergencyContactPhone || '',
          emergencyContactRelationship: user.student.emergencyContactRelationship || '',
          medicalConditions: user.student.medicalConditions || '',
          allergies: user.student.allergies || '',
          medications: user.student.medications || '',
          insuranceProvider: user.student.insuranceProvider || '',
          insurancePolicyNumber: user.student.insurancePolicyNumber || '',
          profilePictureUrl: user.student.profilePictureUrl || '',
        });
      }

      // Load guardian data if available
      if (user.guardianStudents && user.guardianStudents.length > 0) {
        const guardianStudent = user.guardianStudents[0];
        if (guardianStudent.guardian) {
          setGuardianData({
            firstName: guardianStudent.guardian.user?.firstName || '',
            lastName: guardianStudent.guardian.user?.lastName || '',
            email: guardianStudent.guardian.user?.email || '',
            phone: guardianStudent.guardian.user?.phone || '',
            relationship: guardianStudent.relationship || '',
            address: guardianStudent.guardian.address || '',
            city: guardianStudent.guardian.city || '',
            state: guardianStudent.guardian.state || '',
            zipCode: guardianStudent.guardian.zipCode || '',
          });
        }
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      // Validate passwords if changing
      if (profileData.newPassword || profileData.confirmPassword) {
        if (!profileData.currentPassword) {
          throw new Error('Current password is required to change password');
        }
        if (profileData.newPassword !== profileData.confirmPassword) {
          throw new Error('New passwords do not match');
        }
        if (profileData.newPassword.length < 8) {
          throw new Error('New password must be at least 8 characters long');
        }
      }

      // Prepare update data
      const updateData: any = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
      };

      if (profileData.newPassword) {
        updateData.currentPassword = profileData.currentPassword;
        updateData.newPassword = profileData.newPassword;
      }

      await authAPI.updateProfile(updateData);
      setSuccess('Profile updated successfully!');
      
      // Clear password fields
      setProfileData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-butter-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-copper-600 mx-auto mb-4"></div>
          <p className="text-barn-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-butter-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Link 
                href="/portal/user"
                className="flex items-center text-barn-600 hover:text-barn-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-barn-900">Profile Settings</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-soft p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{success}</span>
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h2 className="text-xl font-semibold text-barn-900 mb-6 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-barn-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={profileData.firstName}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-barn-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={profileData.lastName}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-barn-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-barn-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                  />
                </div>
              </div>
            </div>

            {/* Student Information (if user is a student) */}
            {user?.student && (
              <div>
                <h2 className="text-xl font-semibold text-barn-900 mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Student Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-barn-700 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="text"
                      value={studentData.dateOfBirth || 'Not provided'}
                      disabled
                      className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-barn-700 mb-2">
                      Experience Level
                    </label>
                    <input
                      type="text"
                      value={studentData.experienceLevel || 'Not provided'}
                      disabled
                      className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-barn-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        value={studentData.emergencyContactName || 'Not provided'}
                        disabled
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        Emergency Contact Phone
                      </label>
                      <input
                        type="text"
                        value={studentData.emergencyContactPhone || 'Not provided'}
                        disabled
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-barn-700 mb-2">
                      Relationship to Student
                    </label>
                    <input
                      type="text"
                      value={studentData.emergencyContactRelationship || 'Not provided'}
                      disabled
                      className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                {/* Medical Information */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-barn-900 mb-4">Medical Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        Medical Conditions
                      </label>
                      <textarea
                        value={studentData.medicalConditions || 'None reported'}
                        disabled
                        rows={3}
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        Allergies
                      </label>
                      <textarea
                        value={studentData.allergies || 'None reported'}
                        disabled
                        rows={2}
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        Current Medications
                      </label>
                      <textarea
                        value={studentData.medications || 'None reported'}
                        disabled
                        rows={2}
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Insurance Information */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-barn-900 mb-4">Insurance Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        Insurance Provider
                      </label>
                      <input
                        type="text"
                        value={studentData.insuranceProvider || 'Not provided'}
                        disabled
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        Policy Number
                      </label>
                      <input
                        type="text"
                        value={studentData.insurancePolicyNumber || 'Not provided'}
                        disabled
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Guardian Information (if user is a student) */}
            {guardianData.firstName && (
              <div>
                <h2 className="text-xl font-semibold text-barn-900 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Parent/Guardian Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-barn-700 mb-2">
                      Guardian Name
                    </label>
                    <input
                      type="text"
                      value={`${guardianData.firstName} ${guardianData.lastName}`}
                      disabled
                      className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-barn-700 mb-2">
                      Relationship
                    </label>
                    <input
                      type="text"
                      value={guardianData.relationship || 'Not specified'}
                      disabled
                      className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-barn-700 mb-2">
                      Guardian Email
                    </label>
                    <input
                      type="email"
                      value={guardianData.email || 'Not provided'}
                      disabled
                      className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-barn-700 mb-2">
                      Guardian Phone
                    </label>
                    <input
                      type="text"
                      value={guardianData.phone || 'Not provided'}
                      disabled
                      className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>

                {guardianData.address && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-barn-700 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      value={guardianData.address}
                      disabled
                      className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                )}

                {(guardianData.city || guardianData.state || guardianData.zipCode) && (
                  <div className="grid grid-cols-3 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={guardianData.city || ''}
                        disabled
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        State
                      </label>
                      <input
                        type="text"
                        value={guardianData.state || ''}
                        disabled
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-barn-700 mb-2">
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        value={guardianData.zipCode || ''}
                        disabled
                        className="block w-full px-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Password Change */}
            <div>
              <h2 className="text-xl font-semibold text-barn-900 mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                Change Password
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Leave password fields blank if you don't want to change your password.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-barn-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      id="currentPassword"
                      name="currentPassword"
                      value={profileData.currentPassword}
                      onChange={handleChange}
                      className="block w-full px-3 py-3 pr-10 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-barn-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="newPassword"
                        name="newPassword"
                        value={profileData.newPassword}
                        onChange={handleChange}
                        minLength={8}
                        className="block w-full px-3 py-3 pr-10 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-barn-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={profileData.confirmPassword}
                        onChange={handleChange}
                        minLength={8}
                        className="block w-full px-3 py-3 pr-10 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-copper-500 text-white rounded-lg hover:bg-copper-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
