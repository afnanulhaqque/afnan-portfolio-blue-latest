import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Maximize2, Minimize2, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';
import { validateAndConvertImageUrl } from '../utils/imageUtils';

const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { getCertificate } = useSupabase();
  const [isFullSize, setIsFullSize] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCertificate = async () => {
      try {
        if (!id) {
          throw new Error('Certificate ID is required');
        }

        const cert = await getCertificate(id);
        if (!cert) {
          throw new Error('Certificate not found');
        }

        setCertificate(cert);
        
        if (cert.image_url) {
          const url = await validateAndConvertImageUrl(cert.image_url);
          setImageUrl(url);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load certificate');
      } finally {
        setLoading(false);
      }
    };

    loadCertificate();
  }, [id, getCertificate]);

  const toggleFullSize = () => {
    setIsFullSize(!isFullSize);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'Certificate not found'}</p>
          <button
            onClick={() => navigate('/certificates')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Certificates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/certificates')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Certificates
        </button>

        <div className={`rounded-lg shadow-xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
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
    </div>
  );
};

export default CertificateDetail; 