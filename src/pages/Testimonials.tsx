import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import TestimonialCard from '../components/TestimonialCard';
import UserTestimonialForm from '../components/UserTestimonialForm';
import { useSupabase } from '../context/SupabaseContext';

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

const Testimonials: React.FC = () => {
  const { theme } = useTheme();
  const { supabase } = useSupabase();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data: testimonialsData, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching testimonials:', error);
          throw error;
        }

        if (testimonialsData) {
          const validTestimonials = testimonialsData.map(testimonial => ({
            ...testimonial,
            is_approved: testimonial.is_approved ?? false,
            created_at: testimonial.created_at ?? new Date().toISOString()
          }));
          setTestimonials(validTestimonials);
        } else {
          setTestimonials([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, [supabase]);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8">
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Client </span>
          <span className="text-blue-600">Testimonials</span>
        </h1>

        {loading ? (
          <div className={`text-center py-8 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Loading testimonials...
          </div>
        ) : testimonials.length === 0 ? (
          <div className={`text-center py-12 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            No testimonials available yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">
            <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Share Your </span>
            <span className="text-blue-600">Experience</span>
          </h2>
          <UserTestimonialForm />
        </div>
      </motion.div>
    </div>
  );
};

export default Testimonials; 