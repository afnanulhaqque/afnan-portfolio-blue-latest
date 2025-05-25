import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, Certificate } from '../context/SupabaseContext';
import CertificateCard from '../components/CertificateCard';

const Certificates: React.FC = () => {
  const { theme } = useTheme();
  const { getCertificates } = useSupabase();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [filter, setFilter] = useState<'all' | 'event' | 'course'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const certificatesData = await getCertificates();
        console.log('Fetched certificates data:', certificatesData);
        setCertificates(certificatesData);
        console.log('Certificates state after setting:', certificatesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, [getCertificates]);

  const filteredCertificates = filter === 'all' 
    ? certificates 
    : certificates.filter(cert => {
        console.log('Filtering certificate:', {
          title: cert.title,
          type: cert.type,
          filter: filter,
          matches: cert.type === filter
        });
        return cert.type === filter;
      });

  console.log('All certificates:', certificates);
  console.log('Current filter:', filter);
  console.log('Filtered certificates:', filteredCertificates);

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
        <>
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('event')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                filter === 'event'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Events
            </button>
            <button
              onClick={() => setFilter('course')}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                filter === 'course'
                  ? 'bg-blue-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Courses
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((certificate, index) => (
                <CertificateCard
                  key={certificate.id}
                  certificate={certificate}
                  index={index}
                />
              ))
            ) : (
              <div className={`col-span-full text-center py-12 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                No certificates found with the selected filter.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Certificates;