'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  Users,
  Calendar,
  Award
} from 'lucide-react';

interface Horse {
  id: number;
  name: string;
  breed: string;
  age: number;
  gender: string;
  status: 'active' | 'inactive' | 'training';
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  imageUrl?: string;
}

export default function AdminHorsesPage() {
  const { user, userType, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [horses, setHorses] = useState<Horse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || userType !== 'admin')) {
      router.push('/login');
      return;
    }

    if (isAuthenticated && userType === 'admin') {
      loadHorses();
    }
  }, [isAuthenticated, userType, isLoading, router]);

  const loadHorses = async () => {
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
        // Mock data for development
        setHorses([
          {
            id: 1,
            name: 'Gentle Spirit',
            breed: 'Quarter Horse',
            age: 12,
            gender: 'Gelding',
            status: 'active',
            level: 'beginner',
            description: 'A gentle and patient horse perfect for beginners. Loves trail rides and has a calm temperament.'
          },
          {
            id: 2,
            name: 'Thunder',
            breed: 'Thoroughbred',
            age: 8,
            gender: 'Gelding',
            status: 'active',
            level: 'intermediate',
            description: 'New addition to our stable! This beautiful 8-year-old gelding is perfect for intermediate riders.'
          },
          {
            id: 3,
            name: 'Luna',
            breed: 'Arabian',
            age: 15,
            gender: 'Mare',
            status: 'active',
            level: 'advanced',
            description: 'Experienced mare with excellent training. Perfect for advanced riders and jumping lessons.'
          },
          {
            id: 4,
            name: 'Shadow',
            breed: 'Morgan',
            age: 10,
            gender: 'Gelding',
            status: 'training',
            level: 'beginner',
            description: 'Currently in training. Will be available for lessons soon.'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading horses:', error);
    }
  };

  const filteredHorses = horses?.filter(horse => {
    if (!horse) return false;
    const matchesSearch = horse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         horse.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || horse.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const getStatusColor = (status: string) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'training': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    if (!level) return 'bg-gray-100 text-gray-800';
    switch (level) {
      case 'beginner': return 'bg-blue-100 text-blue-800';
      case 'intermediate': return 'bg-purple-100 text-purple-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string | undefined | null) => {
    if (!status || typeof status !== 'string') return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatLevel = (level: string | undefined | null) => {
    if (!level || typeof level !== 'string') return 'Unknown';
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  if (isLoading || !horses) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading horses...</p>
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
            <div className="flex items-center space-x-4">
              <Link
                href="/portal/user"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Horse Management</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage horses, their profiles, and availability
                </p>
              </div>
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              <Plus className="h-4 w-4 mr-2" />
              Add New Horse
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search horses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="training">Training</option>
              </select>
            </div>
            <div className="text-right">
              <span className="text-sm text-gray-500">
                {filteredHorses.length} of {horses.length} horses
              </span>
            </div>
          </div>
        </div>

        {/* Horses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHorses && filteredHorses.length > 0 && filteredHorses.map((horse) => {
            if (!horse || !horse.id) return null;
            return (
            <div key={horse.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Heart className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{horse.name}</h3>
                      <p className="text-sm text-gray-500">{horse.breed}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-blue-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Age:</span>
                    <span className="font-medium text-gray-900">{horse.age} years</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Gender:</span>
                    <span className="font-medium text-gray-900">{horse.gender}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(horse.status)}`}>
                      {formatStatus(horse.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Level:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(horse.level)}`}>
                      {formatLevel(horse.level)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 line-clamp-2">{horse.description}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>12 students</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>3 lessons/week</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm font-medium text-gray-900">4.8★</span>
                  </div>
                </div>
                              </div>
              </div>
            );
          })}
        </div>

        {filteredHorses.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No horses found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
