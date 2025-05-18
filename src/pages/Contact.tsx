import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone, Globe } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import ContactForm from '../components/ContactForm';

const Contact: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className="pt-20">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Get In </span>
        <span className="text-blue-600">Touch</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
          
          <p className={`mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Feel free to get in touch with me. I am always open to discussing new projects, creative ideas or opportunities to be part of your vision.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start">
              <div className={`p-3 rounded-full mr-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <MapPin size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Location</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Islamabad, Pakistan
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`p-3 rounded-full mr-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Mail size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Email</h3>
                <a 
                  href="mailto:afnanulhaq4@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  afnanulhaq4@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`p-3 rounded-full mr-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Phone size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Phone</h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  +923317755477
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className={`p-3 rounded-full mr-4 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <Globe size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className={`font-medium ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>Social</h3>
                <div className="flex space-x-3 mt-2">
                  <a 
                    href="https://www.linkedin.com/in/afnanulhaqque" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm px-3 py-1 rounded-full transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    LinkedIn
                  </a>
                  <a 
                    href="https://github.com/afnanulhaquee" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm px-3 py-1 rounded-full transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    GitHub
                  </a>
                  <a 
                    href="https://x.com/afnanulhaqque" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`text-sm px-3 py-1 rounded-full transition-colors duration-300 ${
                      theme === 'dark' 
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-lg p-6 shadow-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
          <ContactForm />
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;