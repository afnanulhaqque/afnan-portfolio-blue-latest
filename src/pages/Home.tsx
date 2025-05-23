import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCvLink = async () => {
      setIsLoading(true);
      try {
        console.log('Starting CV link fetch...');
        
        // First check if we can access the cv table
        const { data: testData, error: testError } = await supabase
          .from('cv')
          .select('*');
          
        console.log('CV table access test:', { testData, testError });
        
        if (testError) {
          console.error('Error accessing cv table:', testError);
          return;
        }
        
        console.log('Successfully accessed cv table, found rows:', testData?.length);
        
        // Now fetch the actual link
        const { data, error } = await supabase
          .from('cv')
          .select('*')
          .limit(1)
          .maybeSingle();
        
        console.log('Raw CV link fetch result (selecting all):', { data, error });
        
        if (error) {
          console.error('Error fetching CV link:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          return;
        }
        
        if (!data) {
          console.log('No CV link found in database');
          return;
        }
        
        if (data.link) {
          // Ensure Dropbox link has dl=1
          const dropboxLink = data.link.includes('dropbox.com') 
            ? data.link.replace('?dl=0', '?dl=1').replace(/\?.*$/, '') + '?dl=1'
            : data.link;
            
          console.log('Successfully found CV link:', dropboxLink);
        }
      } catch (error) {
        console.error('Unexpected error in fetchCvLink:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCvLink();
  }, [supabase]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleResumeDownload = async () => {
    try {
      setIsLoading(true);
      console.log('Starting CV download process...');
      
      // Always fetch fresh link from database
      const { data, error } = await supabase
        .from('cv')
        .select('link')
        .limit(1)
        .maybeSingle();
      
      console.log('CV link fetch response:', { data, error });
      
      if (error) {
        console.error('Download fetch error:', error);
        alert('Error fetching CV link. Please try again.');
        return;
      }
      
      if (!data?.link) {
        console.log('No CV link found in database');
        alert('CV link not available. Please contact the administrator.');
        return;
      }
      
      // Ensure Dropbox link has dl=1
      const dropboxLink = data.link.includes('dropbox.com') 
        ? data.link.replace('?dl=0', '?dl=1').replace(/\?.*$/, '') + '?dl=1'
        : data.link;
        
      console.log('Opening CV link:', dropboxLink);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = dropboxLink;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = 'Afnan_Ul_Haq_CV.pdf'; // Set default filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center items-center text-center px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Hi, I'm </span>
            <span className="text-blue-600">Afnan Ul Haq</span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`text-xl md:text-2xl mb-8 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Information Technology Undergraduate & PR Lead at BlackBox AI
          </motion.p>
          
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
              {isLoading ? 'Loading...' : 'Download CV'}
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
      
      {/* About Section Preview */}
      <section id="about-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-3xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                About Me
              </h2>
              
              <p className={`mb-8 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                I currently serve as the PR Lead at BlackBox AI – IIUI, where I oversee communication strategies and public relations initiatives. I'm recognized as an ambassador for multiple prestigious tech platforms and events, combining my technical background with creative media expertise.
              </p>
              
              <Link
                to="/about"
                className="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                Learn more about me
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;