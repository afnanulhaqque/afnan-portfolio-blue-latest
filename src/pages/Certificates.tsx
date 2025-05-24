import React, { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, Certificate } from '../context/SupabaseContext';
import CertificateCard from '../components/CertificateCard';

const Certificates: React.FC = () => {
  const { theme } = useTheme();
  const { getCertificates } = useSupabase();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

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
              No certificates found.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Certificates;