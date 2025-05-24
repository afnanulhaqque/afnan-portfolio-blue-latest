import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../context/SupabaseContext';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  organization: string;
  image_url?: string;
}

const AchievementsAdmin: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const { supabase } = useSupabase();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    organization: '',
    image_url: '',
  });

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAchievement) {
        const { error } = await supabase
          .from('achievements')
          .update(formData)
          .eq('id', editingAchievement.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert([formData]);

        if (error) throw error;
      }

      setFormData({
        title: '',
        description: '',
        date: '',
        organization: '',
        image_url: '',
      });
      setEditingAchievement(null);
      fetchAchievements();
    } catch (error) {
      console.error('Error saving achievement:', error);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingAchievement(achievement);
    setFormData({
      title: achievement.title,
      description: achievement.description,
      date: achievement.date,
      organization: achievement.organization,
      image_url: achievement.image_url || '',
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this achievement?')) {
      try {
        const { error } = await supabase
          .from('achievements')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchAchievements();
      } catch (error) {
        console.error('Error deleting achievement:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Achievements</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Organization</label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              rows={4}
              required
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-4">
          {editingAchievement && (
            <button
              type="button"
              onClick={() => {
                setEditingAchievement(null);
                setFormData({
                  title: '',
                  description: '',
                  date: '',
                  organization: '',
                  image_url: '',
                });
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingAchievement ? 'Update Achievement' : 'Add Achievement'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            {achievement.image_url && (
              <div className="h-48 overflow-hidden">
                <img
                  src={achievement.image_url}
                  alt={achievement.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{achievement.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{achievement.description}</p>
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                <p>{achievement.organization}</p>
                <p>{new Date(achievement.date).toLocaleDateString()}</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEdit(achievement)}
                  className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Edit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(achievement.id)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsAdmin; 