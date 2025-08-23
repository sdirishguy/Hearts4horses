'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterData } from '@/lib/auth';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar, 
  BookOpen, 
  ArrowRight,
  Upload,
  Camera,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

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
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    guardianFirstName: '',
    guardianLastName: '',
    guardianEmail: '',
    guardianPhone: '',
    guardianRelationship: '',
    guardianAddress: '',
    guardianCity: '',
    guardianState: '',
    guardianZipCode: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { register } = useAuth();
  const router = useRouter();

  const totalSteps = formData.userType === 'student' ? 4 : 2;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Profile picture must be less than 5MB');
        return;
      }
      
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicturePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Registration: Starting registration process...');
      await register(formData);
      console.log('Registration: Register function completed successfully');
      router.push('/portal/user');
    } catch (error: any) {
      console.error('Registration: Error occurred:', error);
      setError(error.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.email && formData.password && formData.firstName && formData.lastName;
      case 2:
        if (formData.userType === 'student') {
          return formData.dateOfBirth && formData.experienceLevel;
        }
        return true;
      case 3:
        return formData.guardianFirstName && formData.guardianLastName && formData.guardianEmail && formData.guardianPhone;
      case 4:
        return formData.emergencyContactName && formData.emergencyContactPhone;
      default:
        return true;
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            i + 1 < currentStep 
              ? 'bg-green-500 text-white' 
              : i + 1 === currentStep 
                ? 'bg-copper-500 text-white' 
                : 'bg-gray-200 text-gray-500'
          }`}>
            {i + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 h-1 mx-2 ${
              i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-barn-900">Account Information</h3>
      
      {/* User Type Selection */}
      <div>
        <label htmlFor="userType" className="block text-sm font-medium text-barn-700 mb-2">
          I am a... *
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
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
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
            value={formData.lastName}
            onChange={handleChange}
            required
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-barn-700 mb-2">
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-barn-700 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-barn-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="block w-full px-3 py-3 pr-10 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
        <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters long</p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-barn-900">Student Information</h3>
      
      {/* Date of Birth */}
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-barn-700 mb-2">
          Date of Birth *
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        />
      </div>

      {/* Experience Level */}
      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium text-barn-700 mb-2">
          Riding Experience Level *
        </label>
        <select
          id="experienceLevel"
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={handleChange}
          required
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        >
          <option value="">Select experience level</option>
          <option value="beginner">Beginner (never ridden before)</option>
          <option value="novice">Novice (some riding experience)</option>
          <option value="intermediate">Intermediate (regular rider)</option>
          <option value="advanced">Advanced (experienced rider)</option>
        </select>
      </div>

      {/* Profile Picture */}
      <div>
        <label className="block text-sm font-medium text-barn-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          {profilePicturePreview ? (
            <div className="relative">
              <img
                src={profilePicturePreview}
                alt="Profile preview"
                className="w-20 h-20 rounded-full object-cover border-2 border-copper-500"
              />
              <button
                type="button"
                onClick={() => {
                  setProfilePicture(null);
                  setProfilePicturePreview('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-4 py-2 border border-copper-500 text-copper-600 rounded-lg hover:bg-copper-50 transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="mt-1 text-sm text-gray-500">Upload a clear photo (max 5MB)</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-barn-900">Parent/Guardian Information</h3>
      <p className="text-sm text-gray-600">Please provide information for the student's parent or legal guardian.</p>
      
      {/* Guardian Name */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="guardianFirstName" className="block text-sm font-medium text-barn-700 mb-2">
            Guardian First Name *
          </label>
          <input
            type="text"
            id="guardianFirstName"
            name="guardianFirstName"
            value={formData.guardianFirstName}
            onChange={handleChange}
            required
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
        <div>
          <label htmlFor="guardianLastName" className="block text-sm font-medium text-barn-700 mb-2">
            Guardian Last Name *
          </label>
          <input
            type="text"
            id="guardianLastName"
            name="guardianLastName"
            value={formData.guardianLastName}
            onChange={handleChange}
            required
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
      </div>

      {/* Guardian Contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="guardianEmail" className="block text-sm font-medium text-barn-700 mb-2">
            Guardian Email *
          </label>
          <input
            type="email"
            id="guardianEmail"
            name="guardianEmail"
            value={formData.guardianEmail}
            onChange={handleChange}
            required
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
        <div>
          <label htmlFor="guardianPhone" className="block text-sm font-medium text-barn-700 mb-2">
            Guardian Phone *
          </label>
          <input
            type="tel"
            id="guardianPhone"
            name="guardianPhone"
            value={formData.guardianPhone}
            onChange={handleChange}
            required
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
      </div>

      {/* Guardian Relationship */}
      <div>
        <label htmlFor="guardianRelationship" className="block text-sm font-medium text-barn-700 mb-2">
          Relationship to Student *
        </label>
        <select
          id="guardianRelationship"
          name="guardianRelationship"
          value={formData.guardianRelationship}
          onChange={handleChange}
          required
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        >
          <option value="">Select relationship</option>
          <option value="parent">Parent</option>
          <option value="guardian">Legal Guardian</option>
          <option value="grandparent">Grandparent</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Guardian Address */}
      <div>
        <label htmlFor="guardianAddress" className="block text-sm font-medium text-barn-700 mb-2">
          Address
        </label>
        <input
          type="text"
          id="guardianAddress"
          name="guardianAddress"
          value={formData.guardianAddress}
          onChange={handleChange}
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="guardianCity" className="block text-sm font-medium text-barn-700 mb-2">
            City
          </label>
          <input
            type="text"
            id="guardianCity"
            name="guardianCity"
            value={formData.guardianCity}
            onChange={handleChange}
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
        <div>
          <label htmlFor="guardianState" className="block text-sm font-medium text-barn-700 mb-2">
            State
          </label>
          <input
            type="text"
            id="guardianState"
            name="guardianState"
            value={formData.guardianState}
            onChange={handleChange}
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
        <div>
          <label htmlFor="guardianZipCode" className="block text-sm font-medium text-barn-700 mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            id="guardianZipCode"
            name="guardianZipCode"
            value={formData.guardianZipCode}
            onChange={handleChange}
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-barn-900">Emergency Contact & Medical Information</h3>
      
      {/* Emergency Contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="emergencyContactName" className="block text-sm font-medium text-barn-700 mb-2">
            Emergency Contact Name *
          </label>
          <input
            type="text"
            id="emergencyContactName"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            required
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
        <div>
          <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-barn-700 mb-2">
            Emergency Contact Phone *
          </label>
          <input
            type="tel"
            id="emergencyContactPhone"
            name="emergencyContactPhone"
            value={formData.emergencyContactPhone}
            onChange={handleChange}
            required
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-barn-700 mb-2">
          Relationship to Student *
        </label>
        <select
          id="emergencyContactRelationship"
          name="emergencyContactRelationship"
          value={formData.emergencyContactRelationship}
          onChange={handleChange}
          required
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        >
          <option value="">Select relationship</option>
          <option value="parent">Parent</option>
          <option value="guardian">Guardian</option>
          <option value="grandparent">Grandparent</option>
          <option value="sibling">Sibling</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Medical Information */}
      <div>
        <label htmlFor="medicalConditions" className="block text-sm font-medium text-barn-700 mb-2">
          Medical Conditions
        </label>
        <textarea
          id="medicalConditions"
          name="medicalConditions"
          value={formData.medicalConditions}
          onChange={handleChange}
          rows={3}
          placeholder="Please list any medical conditions that may affect riding..."
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        />
      </div>

      <div>
        <label htmlFor="allergies" className="block text-sm font-medium text-barn-700 mb-2">
          Allergies
        </label>
        <textarea
          id="allergies"
          name="allergies"
          value={formData.allergies}
          onChange={handleChange}
          rows={2}
          placeholder="Please list any allergies..."
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        />
      </div>

      <div>
        <label htmlFor="medications" className="block text-sm font-medium text-barn-700 mb-2">
          Current Medications
        </label>
        <textarea
          id="medications"
          name="medications"
          value={formData.medications}
          onChange={handleChange}
          rows={2}
          placeholder="Please list any current medications..."
          className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
        />
      </div>

      {/* Insurance Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="insuranceProvider" className="block text-sm font-medium text-barn-700 mb-2">
            Insurance Provider
          </label>
          <input
            type="text"
            id="insuranceProvider"
            name="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={handleChange}
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
        <div>
          <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-barn-700 mb-2">
            Policy Number
          </label>
          <input
            type="text"
            id="insurancePolicyNumber"
            name="insurancePolicyNumber"
            value={formData.insurancePolicyNumber}
            onChange={handleChange}
            className="block w-full px-3 py-3 border border-butter-300 rounded-lg focus:ring-2 focus:ring-copper-500 focus:border-copper-500 text-barn-900"
          />
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return formData.userType === 'student' ? renderStep2() : null;
      case 3:
        return formData.userType === 'student' ? renderStep3() : null;
      case 4:
        return formData.userType === 'student' ? renderStep4() : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-butter-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-barn-900">
            Join Hearts4Horses Equestrian Center
          </h2>
          <p className="mt-2 text-barn-700">
            Create your account to start your equestrian journey
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {renderStepIndicator()}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {renderCurrentStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="px-6 py-3 bg-copper-500 text-white rounded-lg hover:bg-copper-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading || !isStepValid(currentStep)}
                  className="px-6 py-3 bg-copper-500 text-white rounded-lg hover:bg-copper-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-copper-600 hover:text-copper-500 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
