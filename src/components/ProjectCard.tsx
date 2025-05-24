import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Project } from '../context/SupabaseContext';
import { validateAndConvertImageUrl } from '../utils/imageUtils';

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const loadImage = async () => {
      if (project.image_url) {
        try {
          setImageLoading(true);
          setImageError(false);
          const convertedUrl = await validateAndConvertImageUrl(project.image_url);
          setImageUrl(convertedUrl);
        } catch (error) {
          console.error('Error loading image:', error);
          setImageError(true);
        } finally {
          setImageLoading(false);
        }
      }
    };

    loadImage();
  }, [project.image_url]);

  const handleImageError = () => {
    console.error('Failed to load image:', {
      originalUrl: project.image_url,
      convertedUrl: imageUrl
    });
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
        theme === 'dark' ? 'bg-gray-900 hover:shadow-blue-500/20' : 'bg-white hover:shadow-blue-500/30'
      }`}
    >
      {project.image_url && (
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
          {imageLoading && (
            <div className={`absolute inset-0 flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}
          {!imageError ? (
            <img
              src={imageUrl}
              alt={project.title}
              className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
              loading="lazy"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <div className="text-center">
                <Image size={32} className="mx-auto mb-2 text-gray-400" />
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Image not available
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      
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