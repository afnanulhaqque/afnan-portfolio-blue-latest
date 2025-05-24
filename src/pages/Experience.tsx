import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import ExperienceCard from '../components/ExperienceCard';
import { useSupabase, Experience } from '../context/SupabaseContext';

const ExperiencePage: React.FC = () => {
  const { theme } = useTheme();
  const { getExperience } = useSupabase();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [filter, setFilter] = useState<'all' | 'work' | 'education' | 'volunteer'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const experienceData = await getExperience();
        setExperiences(experienceData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching experience:', error);
        setLoading(false);
      }
    };
    
    fetchExperience();
  }, [getExperience]);
  
  const filteredExperiences = filter === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.type === filter);

  return (
    <div className="pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>My </span>
        <span className="text-blue-600">Experience</span>
      </h1>
      
      {loading ? (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Loading experience...
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('work')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                filter === 'work'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => setFilter('education')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                filter === 'education'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Education
            </button>
            <button
              onClick={() => setFilter('volunteer')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                filter === 'volunteer'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Volunteer Work
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredExperiences.length > 0 ? (
              filteredExperiences.map((experience, index) => (
                <ExperienceCard key={experience.id} experience={experience} index={index} />
              ))
            ) : (
              <div className={`col-span-full text-center py-12 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No experience found with the selected filter.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExperiencePage;