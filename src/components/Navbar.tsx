import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const { isAdmin } = useSupabase();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Experience', path: '/experience' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Testimonials', path: '/testimonials' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled || isMenuOpen 
        ? theme === 'dark' 
          ? 'bg-gray-900/95 backdrop-blur-sm shadow-lg' 
          : 'bg-white/95 backdrop-blur-sm shadow-lg'
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <NavLink to="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold text-blue-600">A<span className="text-sm">fnan</span></span>
          </NavLink>

          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  relative px-1 py-2 text-sm font-medium transition-colors duration-300
                  ${isActive 
                    ? 'text-blue-600' 
                    : theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 w-full bg-blue-600"
                        layoutId="navbar-underline"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full transition-colors duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun size={20} className="text-gray-300 hover:text-white transition-colors" />
              ) : (
                <Moon size={20} className="text-gray-700 hover:text-black transition-colors" />
              )}
            </button>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={`p-2 rounded-full transition-colors duration-300 ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'
                }`}
              >
                <Shield size={20} />
              </NavLink>
            )}

            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-full transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
              ) : (
                <Menu size={24} className={theme === 'dark' ? 'text-white' : 'text-black'} />
              )}
            </button>
          </div>
        </div>
      </div>

      <motion.div
        initial={false}
        animate={{ height: isMenuOpen ? 'auto' : 0, opacity: isMenuOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`md:hidden overflow-hidden ${
          theme === 'dark' ? 'bg-gray-900' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                block py-2 px-3 rounded-md text-center transition-colors duration-300
                ${isActive 
                  ? 'bg-blue-600 text-white' 
                  : theme === 'dark' 
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white' 
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'}
              `}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </motion.div>
    </header>
  );
};

export default Navbar;