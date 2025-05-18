import React, { useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useSupabase } from '../context/SupabaseContext';

const ContactForm: React.FC = () => {
  const { theme } = useTheme();
  const { submitContactForm } = useSupabase();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      await submitContactForm(formData.name, formData.email, formData.message);
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormStatus('error');
      setErrorMessage('Failed to send message. Please try again later.');
      
      // Reset error after 5 seconds
      setTimeout(() => {
        setFormStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };
  
  const inputClasses = `w-full p-3 rounded-md outline-none transition-all duration-300 ${
    theme === 'dark' 
      ? 'bg-gray-900 border border-gray-700 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
      : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
  }`;
  
  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label htmlFor="name" className={`block mb-2 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Name
        </label>
        <input 
          type="text" 
          id="name" 
          name="name" 
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
          className={inputClasses}
        />
      </div>
      
      <div>
        <label htmlFor="email" className={`block mb-2 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Email
        </label>
        <input 
          type="email" 
          id="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
          className={inputClasses}
        />
      </div>
      
      <div>
        <label htmlFor="message" className={`block mb-2 text-sm font-medium ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Message
        </label>
        <textarea 
          id="message" 
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder="Your message"
          className={inputClasses}
        />
      </div>
      
      <button
        type="submit"
        disabled={formStatus === 'submitting'}
        className={`w-full flex items-center justify-center px-6 py-3 rounded-md transition-all duration-300 ${
          formStatus === 'submitting'
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-medium`}
      >
        {formStatus === 'submitting' ? (
          <>
            <Loader size={18} className="animate-spin mr-2" />
            Sending...
          </>
        ) : (
          <>
            <Send size={18} className="mr-2" />
            Send Message
          </>
        )}
      </button>
      
      {formStatus === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-md bg-green-600/20 text-green-500 text-center"
        >
          Thank you! Your message has been sent successfully.
        </motion.div>
      )}
      
      {formStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-md bg-red-600/20 text-red-500 text-center"
        >
          {errorMessage}
        </motion.div>
      )}
    </motion.form>
  );
};

export default ContactForm;