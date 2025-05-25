import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Maximize2, Minimize2, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Certificate } from '../context/SupabaseContext';
import { convertGoogleDriveUrl } from '../utils/imageUtils';

interface CertificateCardProps {
  certificate: Certificate;
  index: number;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ certificate, index }) => {
  const { theme } = useTheme();
  const [isFullSize, setIsFullSize] = useState(false);
  const [showImageError, setShowImageError] = useState(false);

  const toggleFullSize = () => {
    setIsFullSize(!isFullSize);
  };

  const handleImageError = () => {
    setShowImageError(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
          theme === 'dark' ? 'bg-gray-900 hover:shadow-blue-500/20' : 'bg-white hover:shadow-blue-500/30'
        }`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {!showImageError ? (
            <img 
              src={convertGoogleDriveUrl(certificate.image_url)} 
              alt={certificate.title} 
              className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110 cursor-pointer"
              onClick={toggleFullSize}
              onError={handleImageError}
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}>
              <Award size={48} className="text-blue-600" />
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Award size={24} className="text-blue-600 mr-3" />
            <h3 className="text-xl font-bold">{certificate.title}</h3>
          </div>
          
          <div className="flex items-center mb-2">
            <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
              certificate.type === 'event'
                ? 'bg-blue-600/20 text-blue-500'
                : 'bg-emerald-600/20 text-emerald-500'
            }`}>
              {certificate.type === 'event' ? 'Event' : 'Course'}
            </span>
          </div>
          
          <p className={`text-sm mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Issued by {certificate.issuer}
          </p>
          
          <p className={`text-sm mb-4 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {new Date(certificate.date).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric'
            })}
          </p>
          
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {certificate.description}
          </p>
        </div>
      </motion.div>

      {/* Full-size Image Modal */}
      {isFullSize && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={toggleFullSize}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
            >
              <X size={24} className="text-white" />
            </button>
            
            <img
              src={convertGoogleDriveUrl(certificate.image_url)}
              alt={certificate.title}
              className="max-w-full max-h-full object-contain"
              onClick={toggleFullSize}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CertificateCard; 