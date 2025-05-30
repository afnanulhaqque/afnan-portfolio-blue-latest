import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';
import CVGenerator from '../components/CVGenerator';

interface AboutSection {
  tagline?: string;
}

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [tagline, setTagline] = useState<string | null>(null);
  const [taglineLoading, setTaglineLoading] = useState(true);
  const [showCVGenerator, setShowCVGenerator] = useState(false);

  useEffect(() => {
    const fetchTagline = async () => {
      setTaglineLoading(true);
      try {
        const { data, error } = await supabase
          .from('about_section')
          .select('tagline')
          .single();

        if (error) {
          console.error('Error fetching tagline:', error);
        }

        if (data) {
          setTagline(data.tagline);
        }
      } catch (error) {
        console.error('Unexpected error fetching tagline:', error);
      } finally {
        setTaglineLoading(false);
      }
    };

    fetchTagline();
  }, [supabase]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = () => {
    setIsLoading(true);
    setShowCVGenerator(true);
  };

  const handleCVGenerationComplete = () => {
    setIsLoading(false);
    setShowCVGenerator(false);
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Hi, I'm </span>
            <span className="text-blue-600">Afnan Ul Haq</span>
          </h1>
          
          <p className={`text-xl md:text-2xl mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {taglineLoading ? 'Loading...' : tagline || 'Information Technology Undergraduate'}
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/portfolio"
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              View My Work
              <ArrowRight size={18} className="ml-2" />
            </Link>
            
            <button
              onClick={handleResumeDownload}
              disabled={isLoading}
              className={`flex items-center justify-center px-6 py-3 rounded-md transition-colors duration-300 cursor-pointer ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Generating CV...' : 'Download CV'}
              <Download size={18} className="ml-2" />
            </button>
          </motion.div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <button
            onClick={scrollToAbout}
            className={`p-2 rounded-full animate-bounce ${
              theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
            }`}
            aria-label="Scroll Down"
          >
            <ChevronDown size={24} />
          </button>
        </motion.div>
      </section>

      {showCVGenerator && (
        <CVGenerator onGenerationComplete={handleCVGenerationComplete} />
      )}
    </>
  );
};

export default Home;