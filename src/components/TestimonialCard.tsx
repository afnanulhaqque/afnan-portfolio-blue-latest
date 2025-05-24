import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { convertGoogleDriveUrl } from '../utils/imageUtils';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center mb-4">
        {testimonial.image_url ? (
          <img
            src={convertGoogleDriveUrl(testimonial.image_url)}
            alt={testimonial.name}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold">{testimonial.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
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
      
      <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.content}"</p>
    </motion.div>
  );
};

export default TestimonialCard; 