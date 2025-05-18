import React from 'react';
import { Calendar, Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Experience } from '../context/SupabaseContext';

interface ExperienceCardProps {
  experience: Experience;
  index: number;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, index }) => {
  const { theme } = useTheme();
  
  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  const startDate = formatDate(experience.start_date);
  const endDate = formatDate(experience.end_date);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`p-6 rounded-lg shadow-md transition-all duration-300 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="flex items-center mb-2">
        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
          experience.type === 'work'
            ? 'bg-blue-600/20 text-blue-500'
            : 'bg-emerald-600/20 text-emerald-500'
        }`}>
          {experience.type === 'work' ? 'Work Experience' : 'Education'}
        </span>
      </div>
      
      <h3 className={`text-xl font-bold mb-1 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {experience.position}
      </h3>
      
      <div className="flex items-center mb-2">
        <Building size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
        <span className={`ml-2 text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {experience.organization}
        </span>
      </div>
      
      <div className="flex items-center mb-4">
        <Calendar size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
        <span className={`ml-2 text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {startDate} - {endDate}
        </span>
      </div>
      
      <p className={`text-sm ${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {experience.description}
      </p>
    </motion.div>
  );
};

export default ExperienceCard;