import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, Image, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { Project } from '../context/SupabaseContext';
import { handleImageUpload } from '../utils/imageUtils';

interface ProjectCardProps {
  project: Project;
  index: number;
  onImageUpdate?: (projectId: string, imageUrl: string) => Promise<void>;
  isEditable?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  index, 
  onImageUpdate,
  isEditable = false 
}) => {
  const { theme } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(project.image_url || '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (project.image_url) {
      setImageUrl(project.image_url);
      setImageLoading(false);
      setImageError(false);
    }
  }, [project.image_url]);

  const handleImageError = () => {
    console.error('Failed to load image:', {
      originalUrl: project.image_url,
      currentUrl: imageUrl
    });
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImageUpdate) return;

    try {
      setIsUploading(true);
      const base64Image = await handleImageUpload(file);
      await onImageUpdate(project.id, base64Image);
      setImageUrl(base64Image);
      setImageError(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      setImageError(true);
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
      <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
        {imageLoading && (
          <div className={`absolute inset-0 flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
        {!imageError ? (
          <>
            <img
              src={imageUrl}
              alt={project.title}
              className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
            {isEditable && (
              <button
                onClick={triggerFileInput}
                className={`absolute bottom-2 right-2 p-2 rounded-full ${
                  theme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:bg-gray-100'
                } shadow-lg transition-colors duration-200`}
                title="Upload new image"
              >
                <Upload size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} />
              </button>
            )}
          </>
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <div className="text-center">
              <Image size={32} className="mx-auto mb-2 text-gray-400" />
              <p className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {isEditable ? 'Click to upload image' : 'Image not available'}
              </p>
              {isEditable && (
                <button
                  onClick={triggerFileInput}
                  className={`mt-2 px-4 py-2 rounded-md text-sm ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-colors duration-200`}
                >
                  Upload Image
                </button>
              )}
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="hidden"
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
          {isEditable && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;