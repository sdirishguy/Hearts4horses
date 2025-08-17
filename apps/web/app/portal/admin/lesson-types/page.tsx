'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  BookOpen,
  Clock,
  DollarSign,
  ArrowLeft,
  LogOut
} from 'lucide-react';

interface LessonType {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  requirements?: string;
  maxStudents?: number;
}

export default function LessonTypesManagement() {
  const { user, userType, isLoading, isAuthenticated, logout } = useAuth();
  const [lessonTypes, setLessonTypes] = useState<LessonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'admin')) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, userType, isLoading]);

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      fetchLessonTypes();
    }
  }, [isAuthenticated, userType]);

  const fetchLessonTypes = async () => {
    try {
      const response = await fetch('/api/v1/admin/lesson-types', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLessonTypes(data.lessonTypes || []);
      } else {
        console.error('Failed to fetch lesson types');
      }
    } catch (error) {
      console.error('Error fetching lesson types:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (lessonTypeId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/admin/lesson-types/${lessonTypeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setLessonTypes(lessonTypes.map(lt => 
          lt.id === lessonTypeId ? { ...lt, isActive: !currentStatus } : lt
        ));
      }
    } catch (error) {
      console.error('Error updating lesson type:', error);
    }
  };

  const handleAddLessonType = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const lessonTypeData = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      durationMinutes: parseInt(formData.get('durationMinutes') as string),
      price: parseFloat(formData.get('price') as string),
      requirements: formData.get('requirements') as string || undefined,
      maxStudents: parseInt(formData.get('maxStudents') as string) || undefined,
    };

    try {
      const response = await fetch('/api/v1/admin/lesson-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(lessonTypeData)
      });

      if (response.ok) {
        const newLessonType = await response.json();
        setLessonTypes([...lessonTypes, newLessonType.data]);
        setShowAddModal(false);
        e.currentTarget.reset();
      } else {
        console.error('Failed to add lesson type');
      }
    } catch (error) {
      console.error('Error adding lesson type:', error);
    }
  };

  const filteredLessonTypes = lessonTypes.filter(lessonType => {
    const matchesSearch = lessonType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lessonType.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && lessonType.isActive) ||
                         (filterActive === 'inactive' && !lessonType.isActive);
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson types...</p>
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
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Lesson Types Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage lesson types, pricing, and requirements
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lesson Type
              </button>
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
        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search lesson types..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-4">
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
        </div>

        {/* Lesson Types List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Lesson Types ({filteredLessonTypes.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredLessonTypes.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No lesson types found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm || filterActive !== 'all' 
                    ? 'Try adjusting your search or filter criteria.' 
                    : 'Get started by creating your first lesson type.'}
                </p>
              </div>
            ) : (
              filteredLessonTypes.map((lessonType) => (
                <div key={lessonType.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">{lessonType.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          lessonType.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {lessonType.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="mt-1 text-sm text-gray-600">{lessonType.description}</p>
                      
                      <div className="mt-2 flex items-center space-x-6 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{lessonType.durationMinutes} minutes</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4" />
                          <span>${lessonType.price}</span>
                        </div>
                        {lessonType.maxStudents && (
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>Max {lessonType.maxStudents} students</span>
                          </div>
                        )}
                      </div>
                      
                      {lessonType.requirements && (
                        <p className="mt-2 text-sm text-gray-600">
                          <span className="font-medium">Requirements:</span> {lessonType.requirements}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(lessonType.id, lessonType.isActive)}
                        className={`px-3 py-1 text-sm font-medium rounded-md ${
                          lessonType.isActive
                            ? 'text-red-700 bg-red-100 hover:bg-red-200'
                            : 'text-green-700 bg-green-100 hover:bg-green-200'
                        }`}
                      >
                        {lessonType.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Lesson Type Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Lesson Type</h3>
              <form onSubmit={handleAddLessonType} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration (minutes) *</label>
                    <input
                      type="number"
                      name="durationMinutes"
                      required
                      min="15"
                      step="15"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price ($) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Max Students</label>
                  <input
                    type="number"
                    name="maxStudents"
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Requirements</label>
                  <textarea
                    name="requirements"
                    rows={2}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Add Lesson Type
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
