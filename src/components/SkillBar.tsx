import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Skill } from '../context/SupabaseContext';

interface SkillBarProps {
  skill: Skill;
  index: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ skill, index }) => {
  const { theme } = useTheme();
  
  // Calculate width as percentage
  const widthPercentage = skill.level * 20; // Level is 1-5, convert to percentage
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="mb-4"
    >
      <div className="flex justify-between items-center mb-1">
        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
          {skill.name}
        </span>
        <span className={`text-xs ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {skill.level}/5
        </span>
      </div>
      
      <div className={`w-full h-2 rounded-full overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
      }`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${widthPercentage}%` }}
          transition={{ duration: 0.8, delay: 0.3 + (index * 0.05) }}
          className={`h-full rounded-full ${
            skill.level >= 4 ? 'bg-blue-600' : skill.level >= 3 ? 'bg-blue-500' : 'bg-blue-400'
          }`}
        />
      </div>
    </motion.div>
  );
};

export default SkillBar;