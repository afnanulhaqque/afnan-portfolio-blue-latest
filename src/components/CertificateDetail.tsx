import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Certificate } from '../context/SupabaseContext';

interface CertificateDetailProps {
  certificate: Certificate;
  onClose: () => void;
  imageUrl: string;
}

const CertificateDetail: React.FC<CertificateDetailProps> = ({ certificate, onClose, imageUrl }) => {
  const { theme } = useTheme();
  const [isFullSize, setIsFullSize] = useState(false);

  const toggleFullSize = () => {
    setIsFullSize(!isFullSize);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors z-10"
        >
          <X size={24} className={theme === 'dark' ? 'text-white' : 'text-gray-600'} />
        </button>

        {/* Content */}
        <div className="p-6">
          <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {certificate.title}
          </h2>
          
          <div className="mb-6">
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Issued by: {certificate.issuer}
            </p>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Date: {new Date(certificate.date).toLocaleDateString()}
            </p>
          </div>

          {/* Certificate Image */}
          {imageUrl && (
            <div className="mb-6">
              <div className={`relative ${isFullSize ? 'fixed inset-0 z-50 bg-black bg-opacity-90' : 'w-full max-w-[800px] h-[600px] bg-white rounded-lg overflow-hidden mx-auto'}`}>
                <img
                  src={imageUrl}
                  alt={certificate.title}
                  className={`${isFullSize ? 'w-auto h-auto max-w-none max-h-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' : 'w-full h-full object-contain'} cursor-pointer`}
                  onClick={toggleFullSize}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center ${
                        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                      } rounded">
                        <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    `;
                  }}
                />
                <button
                  onClick={toggleFullSize}
                  className={`absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  {isFullSize ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                </button>
              </div>
            </div>
          )}

          {/* Description */}
          <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} max-w-none`}>
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Description
            </h3>
            <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              {certificate.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDetail; 