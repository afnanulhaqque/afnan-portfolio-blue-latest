import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSupabase, Certificate } from '../context/SupabaseContext';
import { useTheme } from '../context/ThemeContext';
import { convertGoogleDriveUrl } from '../utils/imageUtils';
import { Award, Calendar, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const CertificateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { supabase } = useSupabase();
  const { theme } = useTheme();
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('certificates')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          setCertificate(data);
        } else {
          setError('Certificate not found.');
        }
      } catch (err: any) {
        console.error('Error fetching certificate details:', err);
        setError('Failed to load certificate details: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCertificate();
    } else {
      setError('No certificate ID provided.');
      setLoading(false);
    }
  }, [id, supabase]);

  if (loading) {
    return (
      <div className={`pt-20 flex justify-center items-center ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        <Loader size={24} className="animate-spin mr-2" /> Loading certificate...
      </div>
    );
  }

  if (error) {
    return (
      <div className={`pt-20 text-center text-red-600`}>
        {error}
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className={`pt-20 text-center ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Certificate not found.
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-20 container mx-auto px-4"
    >
      <h1 className={`text-3xl md:text-4xl font-bold mb-8 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {certificate.title}
      </h1>

      <div className={`rounded-lg shadow-lg p-6 mb-8 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="flex items-center mb-4">
          <Award size={24} className="text-blue-600 mr-3" />
          <h3 className={`text-xl font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center">
            <Building size={16} className={`mr-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}/>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Issued by: {certificate.issuer}</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className={`mr-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}/>
            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              Date: {new Date(certificate.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {certificate.description && (
          <div className={`mt-4 pt-4 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h4 className={`text-lg font-semibold mb-2 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Description</h4>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
              {certificate.description}
            </p>
          </div>
        )}
      </div>

      {certificate.image_url && (
        <div className={`rounded-lg shadow-lg overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}>
          <div className="p-6">
            <h3 className={`text-xl font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Certificate Image</h3>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img 
                src={convertGoogleDriveUrl(certificate.image_url)} 
                alt={certificate.title} 
                className="w-full h-full object-contain object-center"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = ''; // Or a placeholder image
                  console.error('Error loading full size certificate image:', e);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CertificateDetail; 