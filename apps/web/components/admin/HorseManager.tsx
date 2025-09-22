'use client';

import { useState, useEffect } from 'react';
import { Users, Edit, Trash2, Plus } from 'lucide-react';
import apiClient from '@/lib/api';

interface HorseData {
  id: string;
  name: string;
  breed?: string;
  temperament?: string;
  isActive: boolean;
}

export default function HorseManager() {
  const [horses, setHorses] = useState<HorseData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHorse, setEditingHorse] = useState<HorseData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    temperament: 'calm',
    bio: ''
  });

  useEffect(() => {
    loadHorses();
  }, []);

  const loadHorses = async () => {
    try {
      const response = await (apiClient.admin as any).getHorses();
      setHorses(response.data);
    } catch (error) {
      console.error('Failed to load horses:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingHorse) {
        await (apiClient.admin as any).updateHorse(editingHorse.id, formData);
      } else {
        await (apiClient.admin as any).createHorse(formData);
      }
      loadHorses();
      setShowForm(false);
      resetForm();
    } catch (error) {
      alert('Failed to save horse');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this horse?')) return;
    
    try {
      await (apiClient.admin as any).deleteHorse(id);
      loadHorses();
    } catch (error) {
      alert('Failed to delete horse');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', breed: '', temperament: 'calm', bio: '' });
    setEditingHorse(null);
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" />
            Horse Management
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-copper text-white px-4 py-2 rounded hover:bg-copper/90"
          >
            <Plus className="h-4 w-4" />
            Add Horse
          </button>
        </div>
      </div>

      {showForm && (
        <div className="p-6 bg-gray-50 border-b">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Breed</label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Temperament</label>
                <select
                  value={formData.temperament}
                  onChange={(e) => setFormData({ ...formData, temperament: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="calm">Calm</option>
                  <option value="spirited">Spirited</option>
                  <option value="steady">Steady</option>
                  <option value="green">Green</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-copper text-white px-4 py-2 rounded hover:bg-copper/90"
              >
                {editingHorse ? 'Update' : 'Create'} Horse
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="divide-y">
        {horses.map((horse) => (
          <div key={horse.id} className="p-4 flex justify-between items-center">
            <div>
              <h3 className="font-medium">{horse.name}</h3>
              <p className="text-sm text-gray-600">
                {horse.breed} • {horse.temperament}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingHorse(horse);
                  setFormData(horse as any);
                  setShowForm(true);
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(horse.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}