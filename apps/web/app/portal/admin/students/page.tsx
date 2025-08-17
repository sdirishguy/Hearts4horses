'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone,
  Calendar,
  BookOpen,
  Users,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userType: 'student' | 'guardian';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Additional fields that might be available
  totalLessons?: number;
  activePackages?: number;
  lastLessonDate?: string;
}

export default function StudentManagement() {
  const { user, userType, isLoading, isAuthenticated, logout } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'guardian'>('all');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'admin')) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, userType, isLoading]);

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      fetchStudents();
    }
  }, [isAuthenticated, userType]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/v1/admin/students', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      (student.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (student.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || student.userType === filterType;
    
    const matchesActive = filterActive === 'all' || 
                         (filterActive === 'active' && student.isActive) ||
                         (filterActive === 'inactive' && !student.isActive);
    
    return matchesSearch && matchesType && matchesActive;
  });

  const handleToggleActive = async (studentId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setStudents(students.map(student => 
          student.id === studentId ? { ...student, isActive: !currentStatus } : student
        ));
      }
    } catch (error) {
      console.error('Error updating student status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || userType !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center gap-4">
                <Link
                  href="/portal/admin"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Admin Dashboard
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Student Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage student accounts, progress, and activity
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as 'all' | 'student' | 'guardian')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="student">Students Only</option>
                <option value="guardian">Guardians Only</option>
              </select>
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Students Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading students...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== 'all' || filterActive !== 'all'
                ? 'Try adjusting your search or filters.' 
                : 'No students have registered yet.'}
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <li key={student.id}>
                  <div className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {(student.firstName?.charAt(0) || '')}{(student.lastName?.charAt(0) || '')}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {student.firstName || 'Unknown'} {student.lastName || 'Name'}
                            </h3>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              student.userType === 'student' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {student.userType === 'student' ? 'Student' : 'Guardian'}
                            </span>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              student.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {student.email || 'No email'}
                            </div>
                            {student.phone && (
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-1" />
                                {student.phone}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                            <span>Joined: {formatDate(student.createdAt)}</span>
                            {student.totalLessons !== undefined && (
                              <span className="flex items-center">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {student.totalLessons} lessons
                              </span>
                            )}
                            {student.lastLessonDate && (
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Last: {formatDate(student.lastLessonDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleActive(student.id, student.isActive)}
                          className={`px-3 py-1 text-xs font-medium rounded-md ${
                            student.isActive
                              ? 'text-red-700 bg-red-100 hover:bg-red-200'
                              : 'text-green-700 bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          {student.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        
                        <button
                          onClick={() => {/* TODO: View student details */}}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
