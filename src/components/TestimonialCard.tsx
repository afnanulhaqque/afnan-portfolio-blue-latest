import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { convertGoogleDriveUrl, validateAndConvertImageUrl } from '../utils/imageUtils';

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: number;
  image_url?: string;
  is_approved: boolean;
  created_at: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  const { theme } = useTheme();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      if (!testimonial.image_url) {
        setIsLoading(false);
        return;
      }

      try {
        // Start loading the image immediately
        const image = new Image();
        const url = await validateAndConvertImageUrl(testimonial.image_url);
        
        // Preload the image
        image.src = url;
        image.onload = () => {
          setImageUrl(url);
          setIsLoading(false);
        };
        image.onerror = () => {
          setImageUrl('https://via.placeholder.com/150?text=User');
          setIsLoading(false);
        };
      } catch (error) {
        console.error('Error loading image:', error);
        setImageUrl('https://via.placeholder.com/150?text=User');
        setIsLoading(false);
      }
    };

    loadImage();
  }, [testimonial.image_url]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`p-6 rounded-lg shadow-md border ${
        theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center mb-4">
        {testimonial.image_url ? (
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 relative">
            {isLoading ? (
              <div className={`w-full h-full flex items-center justify-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <img
                src={imageUrl}
                alt={testimonial.name}
                className="w-full h-full object-cover"
                loading="eager"
                onError={() => setImageUrl('https://via.placeholder.com/150?text=User')}
              />
            )}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mb-4">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className={`font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>{testimonial.name}</h3>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {testimonial.position} at {testimonial.company}
          </p>
        </div>
      </div>
      
      <div className="flex mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
          />
        ))}
      </div>
      
      <p className={`${
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      } italic`}>"{testimonial.content}"</p>
    </motion.div>
  );
};

export default TestimonialCard; 