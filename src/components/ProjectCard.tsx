import React from 'react';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Project } from '../context/SupabaseContext';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
        theme === 'dark' ? 'bg-gray-900 hover:shadow-blue-500/20' : 'bg-white hover:shadow-blue-500/30'
      }`}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={project.image_url} 
          alt={project.title} 
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, i) => (
            <span 
              key={i}
              className={`text-xs px-2 py-1 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-800 text-gray-300' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        
        <p className={`mb-4 text-sm ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {project.description}
        </p>
        
        <div className="flex space-x-3 mt-auto">
          <a 
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-1 text-sm transition-colors duration-300 ${
              theme === 'dark' 
                ? 'text-blue-400 hover:text-blue-300' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            <ExternalLink size={14} />
            <span>Live Demo</span>
          </a>
          <a 
            href={`https://github.com/afnanulhaquee/${project.link.split('/').pop()}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center space-x-1 text-sm transition-colors duration-300 ${
              theme === 'dark' 
                ? 'text-gray-400 hover:text-white' 
                : 'text-gray-600 hover:text-black'
            }`}
          >
            <Github size={14} />
            <span>Source</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;