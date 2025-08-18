'use client';

import { useState } from 'react';
import { authAPI } from '@/lib/auth';

export default function TestAPIPage() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testRegistration = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const testData = {
        email: `test${Date.now()}@example.com`,
        password: 'testpass123',
        firstName: 'Test',
        lastName: 'User',
        userType: 'student' as const,
        experienceLevel: 'beginner'
      };

      console.log('Test API: Sending registration request with data:', testData);
      
      const response = await authAPI.register(testData);
      
      console.log('Test API: Registration successful:', response);
      setResult(`✅ Registration successful!\nUser: ${response.user.email}\nToken: ${response.token.substring(0, 50)}...\nRoles: ${JSON.stringify(response.roles)}`);
    } catch (error: any) {
      console.error('Test API: Registration failed:', error);
      setResult(`❌ Registration failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testLogin = async () => {
    setIsLoading(true);
    setResult('');

    try {
      const testData = {
        email: 'student@example.com',
        password: 'password123'
      };

      console.log('Test API: Sending login request...');
      
      const response = await authAPI.login(testData);
      
      console.log('Test API: Login successful:', response);
      setResult(`✅ Login successful!\nUser: ${response.user.email}\nToken: ${response.token.substring(0, 50)}...\nRoles: ${JSON.stringify(response.roles)}`);
    } catch (error: any) {
      console.error('Test API: Login failed:', error);
      setResult(`❌ Login failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            API Test Page
          </h2>
          <p className="mt-2 text-gray-600">
            Test the registration and login API endpoints
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <button
              onClick={testRegistration}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Registration API'}
            </button>

            <button
              onClick={testLogin}
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Login API'}
            </button>
          </div>

          {result && (
            <div className="mt-4 p-4 rounded-md bg-gray-50">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">{result}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
