import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Linkedin, Github, Mail, Twitter, Instagram } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Footer: React.FC = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <footer className={`py-8 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="h-full flex flex-col justify-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="footer-logo mb-4"
            />
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Information Technology Undergraduate <br />
              PR Lead at BlackBox AI
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/in/afnanulhaqque" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://github.com/afnanulhaqque" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a 
                href="mailto:afnanulhaq4@gmail.com"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a 
                href="https://x.com/afnanulhaqque" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="https://www.instagram.com/afnanulhaqque" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'text-gray-400 hover:text-white hover:bg-gray-800' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-200'
                }`}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('/')}
                  className={`w-full text-left transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('/about')}
                  className={`w-full text-left transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('/portfolio')}
                  className={`w-full text-left transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Portfolio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLinkClick('/contact')}
                  className={`w-full text-left transition-colors duration-300 ${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>Get In Touch</h3>
            <p className={`mb-4 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Interested in collaboration or have questions?
            </p>
            <button 
              onClick={() => handleQuickLinkClick('/contact')}
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Contact Me
            </button>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-6 text-center">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400 border-gray-800' : 'text-gray-500 border-gray-200'
          }`}>
            © {year} Afnan Ul Haq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;