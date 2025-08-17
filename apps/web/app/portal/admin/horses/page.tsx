'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Heart,
  MoreHorizontal,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import Link from 'next/link';

interface Horse {
  id: string;
  name: string;
  breed?: string;
  dob?: string;
  sex?: string;
  temperament?: 'calm' | 'energetic' | 'spirited' | 'gentle';
  weight?: number;
  height?: number;
  bio?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HorseManagement() {
  const { user, userType, isLoading, isAuthenticated, logout } = useAuth();
  const [horses, setHorses] = useState<Horse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingHorse, setEditingHorse] = useState<Horse | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'admin')) {
      window.location.href = '/login';
    }
  }, [isAuthenticated, userType, isLoading]);

  useEffect(() => {
    if (isAuthenticated && userType === 'admin') {
      fetchHorses();
    }
  }, [isAuthenticated, userType]);

  const fetchHorses = async () => {
    try {
      const response = await fetch('/api/v1/admin/horses', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setHorses(data.horses || []);
      } else {
        console.error('Failed to fetch horses');
      }
    } catch (error) {
      console.error('Error fetching horses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHorses = horses.filter(horse => {
    const matchesSearch = horse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (horse.breed && horse.breed.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterActive === 'all' || 
                         (filterActive === 'active' && horse.isActive) ||
                         (filterActive === 'inactive' && !horse.isActive);
    
    return matchesSearch && matchesFilter;
  });

  const handleToggleActive = async (horseId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/v1/admin/horses/${horseId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        setHorses(horses.map(horse => 
          horse.id === horseId ? { ...horse, isActive: !currentStatus } : horse
        ));
      }
    } catch (error) {
      console.error('Error updating horse status:', error);
    }
  };

  const handleAddHorse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const horseData = {
      name: formData.get('name') as string,
      breed: formData.get('breed') as string || undefined,
      sex: formData.get('sex') as string || undefined,
      temperament: formData.get('temperament') as string || undefined,
      bio: formData.get('bio') as string || undefined,
    };

    try {
      const response = await fetch('/api/v1/admin/horses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(horseData)
      });

      if (response.ok) {
        const newHorse = await response.json();
        setHorses([...horses, newHorse.data]);
        setShowAddModal(false);
        // Reset form
        e.currentTarget.reset();
      } else {
        console.error('Failed to add horse');
      }
    } catch (error) {
      console.error('Error adding horse:', error);
    }
  };

  const handleDeleteHorse = async (horseId: string) => {
    if (!confirm('Are you sure you want to delete this horse? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/admin/horses/${horseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        setHorses(horses.filter(horse => horse.id !== horseId));
      }
    } catch (error) {
      console.error('Error deleting horse:', error);
    }
  };

  const handleEditHorse = (horse: Horse) => {
    setEditingHorse(horse);
    setShowEditModal(true);
  };

  const handleUpdateHorse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingHorse) return;

    const formData = new FormData(e.currentTarget);
    
    const horseData = {
      name: formData.get('name') as string,
      breed: formData.get('breed') as string || undefined,
      sex: formData.get('sex') as string || undefined,
      temperament: formData.get('temperament') as string || undefined,
      bio: formData.get('bio') as string || undefined,
    };

    try {
      const response = await fetch(`/api/v1/admin/horses/${editingHorse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(horseData)
      });

      if (response.ok) {
        const updatedHorse = await response.json();
        setHorses(horses.map(horse => 
          horse.id === editingHorse.id ? updatedHorse.data : horse
        ));
        setShowEditModal(false);
        setEditingHorse(null);
      } else {
        console.error('Failed to update horse');
      }
    } catch (error) {
      console.error('Error updating horse:', error);
    }
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
              <h1 className="text-3xl font-bold text-gray-900 mt-2">Horse Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage horses, their profiles, and availability status
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Horse
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
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search horses by name or breed..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value as 'all' | 'active' | 'inactive')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Horses</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Horses Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading horses...</p>
          </div>
        ) : filteredHorses.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No horses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterActive !== 'all' 
                ? 'Try adjusting your search or filters.' 
                : 'Get started by adding your first horse.'}
            </p>
            {!searchTerm && filterActive === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Horse
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHorses.map((horse) => (
              <div key={horse.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900">{horse.name}</h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          horse.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {horse.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {horse.breed && (
                        <p className="text-sm text-gray-500 mt-1">{horse.breed}</p>
                      )}
                      
                      {horse.temperament && (
                        <p className="text-sm text-gray-500 mt-1">
                          Temperament: <span className="capitalize">{horse.temperament}</span>
                        </p>
                      )}
                      
                      {horse.bio && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{horse.bio}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-4 text-xs text-gray-500">
                        {horse.sex && <span>Sex: {horse.sex}</span>}
                        {horse.weight && <span>Weight: {horse.weight}kg</span>}
                        {horse.height && <span>Height: {horse.height}cm</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleToggleActive(horse.id, horse.isActive)}
                        className={`p-1 rounded ${
                          horse.isActive 
                            ? 'text-red-600 hover:bg-red-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={horse.isActive ? 'Deactivate' : 'Activate'}
                      >
                        <Heart className={`h-4 w-4 ${horse.isActive ? 'fill-current' : ''}`} />
                      </button>
                      
                      <button
                        onClick={() => handleEditHorse(horse)}
                        className="p-1 rounded text-gray-600 hover:bg-gray-50"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteHorse(horse.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Horse Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Horse</h3>
              <form onSubmit={handleAddHorse} className="space-y-4">
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
                  <label className="block text-sm font-medium text-gray-700">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sex</label>
                  <select
                    name="sex"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select sex</option>
                    <option value="Mare">Mare</option>
                    <option value="Stallion">Stallion</option>
                    <option value="Gelding">Gelding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Temperament</label>
                  <select
                    name="temperament"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select temperament</option>
                    <option value="calm">Calm</option>
                    <option value="spirited">Spirited</option>
                    <option value="steady">Steady</option>
                    <option value="green">Green</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
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
                    Add Horse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Horse Modal */}
      {showEditModal && editingHorse && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Horse</h3>
              <form onSubmit={handleUpdateHorse} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={editingHorse.name}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    defaultValue={editingHorse.breed || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Sex</label>
                  <select
                    name="sex"
                    defaultValue={editingHorse.sex || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select sex</option>
                    <option value="Mare">Mare</option>
                    <option value="Stallion">Stallion</option>
                    <option value="Gelding">Gelding</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Temperament</label>
                  <select
                    name="temperament"
                    defaultValue={editingHorse.temperament || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select temperament</option>
                    <option value="calm">Calm</option>
                    <option value="spirited">Spirited</option>
                    <option value="steady">Steady</option>
                    <option value="green">Green</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    defaultValue={editingHorse.bio || ''}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingHorse(null);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    Update Horse
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
