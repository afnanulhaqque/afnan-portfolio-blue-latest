import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabase } from '../context/SupabaseContext';
import { Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { convertGoogleDriveUrl } from '../utils/imageUtils';
import Loader from '../components/Loader';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setSelectedImage(null);
  };

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

  if (loading) {
    return <Loader />;
  }

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
            achievements
              .filter(achievement => achievement.is_approved)
              .map((achievement, index) => (
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
                  <button 
                    className="h-48 overflow-hidden w-full focus:outline-none" 
                    onClick={() => handleImageClick(convertGoogleDriveUrl(achievement.image_url!))}
                  >
                    <img 
                      src={convertGoogleDriveUrl(achievement.image_url)} 
                      alt={achievement.title} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    />
                  </button>
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

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseImage}
        >
          <div className="relative">
            <button
              onClick={handleCloseImage}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            <img 
              src={selectedImage} 
              alt="Full size achievement" 
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Achievements; 