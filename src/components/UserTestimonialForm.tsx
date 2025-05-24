import React, { useState } from 'react';
import { useSupabase } from '../context/SupabaseContext';
import { Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const UserTestimonialForm: React.FC = () => {
  const { theme } = useTheme();
  const { supabase } = useSupabase();
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    image_url: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('submitting');
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.name || !formData.position || !formData.company || !formData.content) {
        throw new Error('Please fill in all required fields');
      }

      // Validate rating
      if (formData.rating < 1 || formData.rating > 5) {
        throw new Error('Please select a valid rating');
      }

      // Prepare testimonial data
      const testimonialData = {
        ...formData,
        is_approved: false,
        created_at: new Date().toISOString()
      };

      // Log the data being sent
      console.log('Submitting testimonial data:', testimonialData);

      // First, check if we can connect to Supabase
      const { data: testData, error: testError } = await supabase
        .from('testimonials')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Supabase connection test error:', {
          message: testError.message,
          details: testError.details,
          hint: testError.hint,
          code: testError.code
        });
        throw new Error(`Database connection error: ${testError.message}`);
      }

      // Now try to insert the testimonial
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select();

      if (error) {
        console.error('Supabase insert error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          table: 'testimonials',
          data: testimonialData
        });
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.error('No data returned from insert operation');
        throw new Error('No data returned from the server');
      }

      console.log('Testimonial submitted successfully:', data);
      setSubmitStatus('success');
      setFormData({
        name: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        image_url: ''
      });
    } catch (error: any) {
      console.error('Error submitting testimonial:', {
        error,
        message: error.message,
        stack: error.stack,
        formData
      });
      setSubmitStatus('error');
      setErrorMessage(
        error.message || 
        'There was an error submitting your testimonial. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`rounded-lg shadow-lg p-6 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h2 className="text-2xl font-bold mb-6">Share Your Experience</h2>
      
      {submitStatus === 'success' ? (
        <div className="text-green-600 dark:text-green-400 mb-4">
          Thank you for your testimonial! It will be reviewed and published soon.
        </div>
      ) : submitStatus === 'error' ? (
        <div className="text-red-600 dark:text-red-400 mb-4">
          {errorMessage}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Your Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full p-2 border rounded ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Your Position *
          </label>
          <input
            type="text"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className={`w-full p-2 border rounded ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Your Company *
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className={`w-full p-2 border rounded ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Your Testimonial *
          </label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            className={`w-full p-2 border rounded ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            rows={4}
            required
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Rating *
          </label>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({ ...formData, rating })}
                className="focus:outline-none"
              >
                <Star
                  size={24}
                  className={rating <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}
                  fill={rating <= formData.rating ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Profile Image URL (optional)
          </label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className={`w-full p-2 border rounded ${
              theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
            }`}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
        </button>
      </form>
    </div>
  );
};

export default UserTestimonialForm; 