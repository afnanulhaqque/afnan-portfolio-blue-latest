import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Home: React.FC = () => {
  const { theme } = useTheme();

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about-section');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
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
            
            <a
              href="/resume.pdf"
              download
              className={`flex items-center justify-center px-6 py-3 rounded-md transition-colors duration-300 ${
                theme === 'dark'
                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              Download CV
              <Download size={18} className="ml-2" />
            </a>
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
      <section id="about-section" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <img
                src="https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Afnan Ul Haq"
                className="rounded-lg shadow-lg w-full h-auto max-w-md mx-auto object-cover"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:w-1/2"
            >
              <h2 className="text-3xl font-bold mb-6">
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>About </span>
                <span className="text-blue-600">Me</span>
              </h2>
              
              <p className={`mb-6 leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                I'm a passionate and driven undergraduate student pursuing a Bachelor of Science in Information Technology at the International Islamic University Islamabad (IIUI). With a strong inclination toward technology, media, and community engagement, I've built a diverse portfolio of experience across various domains.
              </p>
              
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