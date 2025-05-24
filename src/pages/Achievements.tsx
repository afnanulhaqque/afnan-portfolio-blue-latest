import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../context/SupabaseContext';
import { Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { convertGoogleDriveUrl } from '../utils/imageUtils';

interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  organization: string;
  image_url?: string;
  is_approved: boolean;
  created_at: string;
  awarded_by?: string;
}

const Achievements: React.FC = () => {
  const { theme } = useTheme();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { supabase } = useSupabase();

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .eq('is_approved', true)
          .order('date', { ascending: false });

        if (error) throw error;
        if (data) {
          const validAchievements = data.map(achievement => ({
            ...achievement,
            is_approved: achievement.is_approved ?? false,
            created_at: achievement.created_at ?? new Date().toISOString(),
            awarded_by: achievement.awarded_by ?? ''
          }));
          setAchievements(validAchievements);
        } else {
          setAchievements([]);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [supabase]);

  return (
    <div className="pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>My </span>
        <span className="text-blue-600">Achievements</span>
      </h1>
      
      {loading ? (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Loading achievements...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {achievements.length > 0 ? (
            achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
                  theme === 'dark' ? 'bg-gray-900 hover:shadow-blue-500/20' : 'bg-white hover:shadow-blue-500/30'
                }`}
              >
                {achievement.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={convertGoogleDriveUrl(achievement.image_url)} 
                      alt={achievement.title} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Trophy size={24} className="text-blue-600 mr-3" />
                    <h3 className="text-xl font-bold">{achievement.title}</h3>
                  </div>
                  
                  <p className={`text-sm mb-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Awarded by {achievement.awarded_by || 'Self'}
                  </p>
                  
                  <p className={`text-sm mb-4 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {achievement.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className={`col-span-full text-center py-12 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No achievements found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Achievements; 