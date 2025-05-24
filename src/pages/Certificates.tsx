import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, Certificate } from '../context/SupabaseContext';
import { convertGoogleDriveUrl } from '../utils/imageUtils';

const Certificates: React.FC = () => {
  const { theme } = useTheme();
  const { getCertificates } = useSupabase();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const certificatesData = await getCertificates();
        setCertificates(certificatesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, [getCertificates]);

  const handleImageError = (certificateId: string) => {
    setImageErrors(prev => ({ ...prev, [certificateId]: true }));
  };

  return (
    <div className="pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>My </span>
        <span className="text-blue-600">Certificates</span>
      </h1>
      
      {loading ? (
        <div className={`text-center py-12 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Loading certificates...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificates.length > 0 ? (
            certificates.map((certificate, index) => (
              <motion.div
                key={certificate.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`rounded-lg overflow-hidden shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${
                  theme === 'dark' ? 'bg-gray-900 hover:shadow-blue-500/20' : 'bg-white hover:shadow-blue-500/30'
                }`}
              >
                <div className="h-48 overflow-hidden">
                  {!imageErrors[certificate.id] ? (
                    <img 
                      src={convertGoogleDriveUrl(certificate.image_url)} 
                      alt={certificate.title} 
                      className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                      onError={() => handleImageError(certificate.id)}
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
            ))
          ) : (
            <div className={`col-span-full text-center py-12 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              No certificates found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificates;