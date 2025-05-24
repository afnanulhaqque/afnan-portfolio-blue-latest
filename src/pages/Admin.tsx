import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Loader, Download, Check, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, ContactMessage, Project, Experience, Skill, Certificate } from '../context/SupabaseContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type ContentType = 'messages' | 'projects' | 'experiences' | 'skills' | 'certificates' | 'cv' | 'testimonials' | 'achievements';

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

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url?: string;
  is_approved: boolean;
  created_at: string;
  awarded_by?: string;
}

const Admin: React.FC = () => {
  const { theme } = useTheme();
  const { supabase } = useSupabase();
  const [activeContent, setActiveContent] = useState<ContentType>('messages');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [cvLink, setCvLink] = useState('');
  const [cvLinkLoading, setCvLinkLoading] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [testimonialForm, setTestimonialForm] = useState<{
    name: string;
    position: string;
    company: string;
    content: string;
    rating: number;
    image_url: string;
    is_approved: boolean;
  }>({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    image_url: '',
    is_approved: false
  });
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementForm, setAchievementForm] = useState<{
    title: string;
    description: string;
    date: Date | null;
    image_url: string;
    is_approved: boolean;
    awarded_by: string;
  }>({
    title: '',
    description: '',
    date: null,
    image_url: '',
    is_approved: false,
    awarded_by: ''
  });

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image_url: '',
    tags: '',
    link: ''
  });
  const [experienceForm, setExperienceForm] = useState<{
    position: string;
    organization: string;
    start_date: Date | null;
    end_date: Date | null;
    description: string;
    type: 'work' | 'education' | 'volunteer';
  }>({
    position: '',
    organization: '',
    start_date: null,
    end_date: null,
    description: '',
    type: 'work'
  });
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: '',
    level: 1
  });
  const [certificateForm, setCertificateForm] = useState({
    title: '',
    issuer: '',
    date: '',
    description: '',
    image_url: ''
  });

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
      if (data.session) {
        fetchAllData();
      } else {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [supabase]);

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        throw messagesError;
      }
      setMessages(messagesData || []);

      // Fetch projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (projectsError) {
        console.error('Error fetching projects:', projectsError);
        throw projectsError;
      }
      setProjects(projectsData || []);

      // Fetch experiences
      const { data: experiencesData, error: experiencesError } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });
      
      if (experiencesError) {
        console.error('Error fetching experiences:', experiencesError);
        throw experiencesError;
      }

      if (experiencesData) {
        const formattedExperiences = experiencesData.map(exp => ({
          ...exp,
          start_date: exp.start_date ? new Date(exp.start_date) : null,
          end_date: exp.end_date ? new Date(exp.end_date) : null,
        }));
        setExperiences(formattedExperiences || []);
      } else {
        setExperiences([]);
      }

      // Fetch skills
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });
      
      if (skillsError) {
        console.error('Error fetching skills:', skillsError);
        throw skillsError;
      }
      setSkills(skillsData || []);

      // Fetch certificates
      const { data: certificatesData, error: certificatesError } = await supabase
        .from('certificates')
        .select('*')
        .order('date', { ascending: false });
      
      if (certificatesError) {
        console.error('Error fetching certificates:', certificatesError);
        throw certificatesError;
      }
      setCertificates(certificatesData || []);

      // Fetch testimonials
      const { data: testimonialsData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (testimonialsError) {
        console.error('Error fetching testimonials:', testimonialsError);
        throw testimonialsError;
      }

      if (testimonialsData) {
        // Ensure all testimonials have the required fields
        const validTestimonials = testimonialsData.map(testimonial => ({
          ...testimonial,
          is_approved: testimonial.is_approved ?? false,
          created_at: testimonial.created_at ?? new Date().toISOString()
        }));
        setTestimonials(validTestimonials);
      } else {
        setTestimonials([]);
      }

      // Fetch achievements
      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('date', { ascending: false });
      
      if (achievementsError) {
        console.error('Error fetching achievements:', achievementsError);
        throw achievementsError;
      }

      if (achievementsData) {
        const formattedAchievements = achievementsData.map(ach => ({
          ...ach,
          date: ach.date ? new Date(ach.date) : null,
          is_approved: ach.is_approved ?? false,
          created_at: ach.created_at ?? new Date().toISOString(),
          awarded_by: ach.awarded_by ?? ''
        }));
        setAchievements(formattedAchievements);
      } else {
        setAchievements([]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      setIsAuthenticated(true);
      fetchAllData();
    } catch (err: any) {
      setLoginError(err.message);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
  };

  // Handle project operations
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const projectData = {
        ...projectForm,
        tags: projectForm.tags.split(',').map(tag => tag.trim())
      };

      if (editingId) {
        await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);
      } else {
        await supabase
          .from('projects')
          .insert([projectData]);
      }

      setProjectForm({ title: '', description: '', image_url: '', tags: '', link: '' });
      setEditingId(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  // Handle experience operations
  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...experienceForm,
        start_date: experienceForm.start_date ? experienceForm.start_date.toISOString().split('T')[0] : null,
        end_date: experienceForm.end_date ? experienceForm.end_date.toISOString().split('T')[0] : null,
      };

      if (editingId) {
        await supabase
          .from('experience')
          .update(dataToSubmit)
          .eq('id', editingId);
      } else {
        await supabase
          .from('experience')
          .insert([dataToSubmit]);
      }

      setExperienceForm({
        position: '',
        organization: '',
        start_date: null,
        end_date: null,
        description: '',
        type: 'work'
      });
      setEditingId(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  // Handle skill operations
  const handleSkillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await supabase
          .from('skills')
          .update(skillForm)
          .eq('id', editingId);
      } else {
        await supabase
          .from('skills')
          .insert([skillForm]);
      }

      setSkillForm({ name: '', category: '', level: 1 });
      setEditingId(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  // Handle certificate operations
  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await supabase
          .from('certificates')
          .update(certificateForm)
          .eq('id', editingId);
      } else {
        await supabase
          .from('certificates')
          .insert([certificateForm]);
      }
      setCertificateForm({ title: '', issuer: '', date: '', description: '', image_url: '' });
      setEditingId(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving certificate:', error);
    }
  };

  // Handle testimonial operations
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...testimonialForm,
        created_at: new Date().toISOString()
      };

      if (editingId) {
        const { error } = await supabase
          .from('testimonials')
          .update(dataToSubmit)
          .eq('id', editingId)
          .select();
        
        if (error) {
          console.error('Error updating testimonial:', error);
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([dataToSubmit])
          .select();
        
        if (error) {
          console.error('Error inserting testimonial:', error);
          throw error;
        }
      }

      setTestimonialForm({
        name: '',
        position: '',
        company: '',
        content: '',
        rating: 5,
        image_url: '',
        is_approved: false
      });
      setEditingId(null);
      fetchAllData();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleTestimonialApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error approving testimonial:', error);
        throw error;
      }
      
      fetchAllData();
    } catch (error) {
      console.error('Error approving testimonial:', error);
    }
  };

  // Function to convert Google Drive URL to direct image URL
  const convertGoogleDriveUrl = (url: string) => {
    if (!url) return url;
    
    // If it's already a direct image URL, return as is
    if (url.includes('drive.google.com/uc')) return url;
    
    // Extract file ID from Google Drive URL
    const fileIdMatch = url.match(/\/d\/(.*?)\/|id=(.*?)(&|$)/);
    if (!fileIdMatch) return url;
    
    const fileId = fileIdMatch[1] || fileIdMatch[2];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  };

  // Handle achievement operations
  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!achievementForm.title || !achievementForm.description || !achievementForm.date) {
        alert('Please fill in all required fields');
        return;
      }

      const dataToSubmit = {
        title: achievementForm.title.trim(),
        description: achievementForm.description.trim(),
        date: achievementForm.date.toISOString().split('T')[0],
        image_url: achievementForm.image_url ? convertGoogleDriveUrl(achievementForm.image_url.trim()) : null,
        awarded_by: achievementForm.awarded_by ? achievementForm.awarded_by.trim() : null,
        is_approved: true,
        created_at: new Date().toISOString()
      };

      let error;
      if (editingId) {
        const { error: updateError } = await supabase
          .from('achievements')
          .update(dataToSubmit)
          .eq('id', editingId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('achievements')
          .insert([dataToSubmit]);
        error = insertError;
      }

      if (error) {
        console.error('Error saving achievement:', error);
        alert('Failed to save achievement: ' + error.message);
        return;
      }

      // Reset form and refresh data
      setAchievementForm({
        title: '',
        description: '',
        date: null,
        image_url: '',
        is_approved: false,
        awarded_by: ''
      });
      setEditingId(null);
      await fetchAllData();
      alert('Achievement saved successfully!');
    } catch (error: any) {
      console.error('Error saving achievement:', error);
      alert('Failed to save achievement: ' + (error.message || 'Unknown error'));
    }
  };

  const handleAchievementApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .update({ is_approved: true })
        .eq('id', id)
        .select();
      
      if (error) {
        console.error('Error approving achievement:', error);
        throw error;
      }
      
      fetchAllData();
    } catch (error) {
      console.error('Error approving achievement:', error);
    }
  };

  // Handle delete operations
  const handleDelete = async (table: string, id: string) => {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
      }
      
      fetchAllData();
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
    }
  };

  // Mark message as read
  const markAsRead = async (id: string) => {
    try {
      await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);
      fetchAllData();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Save CV link to Supabase cv table
  const handleCvLinkSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setCvLinkLoading(true);

    try {
      // Ensure Dropbox link has dl=1
      const dropboxLink = cvLink.includes('?dl=1') 
        ? cvLink 
        : cvLink.replace('?dl=0', '?dl=1').replace(/\?.*$/, '') + '?dl=1';

      console.log('Attempting to save CV link:', dropboxLink);

      // First check if any row exists
      const { data: existing, error: checkError } = await supabase
        .from('cv')
        .select('id')
        .maybeSingle();

      console.log('Existing CV record check:', { existing, checkError });

      let error;
      if (existing) {
        // Update existing row
        const { error: updateError } = await supabase
          .from('cv')
          .update({ link: dropboxLink })
          .eq('id', existing.id);
        error = updateError;
        console.log('Updated existing CV record:', { error: updateError });
      } else {
        // Insert new row
        const { error: insertError } = await supabase
          .from('cv')
          .insert([{ link: dropboxLink }]);
        error = insertError;
        console.log('Inserted new CV record:', { error: insertError });
      }

      if (error) {
        console.error('Error saving CV link:', error);
        alert('Failed to save CV link. Please try again.');
      } else {
        alert('CV link saved successfully!');
        // Verify the save by fetching the link
        const { data: verifyData, error: verifyError } = await supabase
          .from('cv')
          .select('link')
          .single();
        
        console.log('Verification after save:', { verifyData, verifyError });
        
        if (verifyData?.link) {
          setCvLink(verifyData.link);
        }
      }
    } catch (err) {
      console.error('Unexpected error saving CV link:', err);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setCvLinkLoading(false);
    }
  };

  // Fetch CV link from Supabase cv table
  const fetchCvLink = async () => {
    setCvLinkLoading(true);
    try {
      console.log('Fetching CV link...');
      const { data, error } = await supabase
        .from('cv')
        .select('link')
        .maybeSingle();
      
      console.log('CV link fetch result:', { data, error });
      
      if (!error && data?.link) {
        setCvLink(data.link);
      } else {
        console.log('No CV link found or error occurred:', error);
      }
    } catch (err) {
      console.error('Error fetching CV link:', err);
    } finally {
      setCvLinkLoading(false);
    }
  };

  useEffect(() => {
    fetchCvLink();
  }, [supabase]);

  if (!isAuthenticated) {
    return (
      <div className="pt-20">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Admin </span>
          <span className="text-blue-600">Login</span>
        </h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={`max-w-md mx-auto p-6 rounded-lg shadow-lg ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block mb-2 text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 rounded-md outline-none transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500'
                    : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                required
              />
            </div>
            
            <div>
              <label className={`block mb-2 text-sm font-medium ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 rounded-md outline-none transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700 text-white focus:border-blue-500'
                    : 'bg-white border border-gray-300 text-gray-900 focus:border-blue-500'
                }`}
                required
              />
            </div>
            
            {loginError && (
              <div className="p-3 rounded-md bg-red-600/20 text-red-500 text-center">
                {loginError}
              </div>
            )}
            
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
            >
              Login
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Admin </span>
          <span className="text-blue-600">Dashboard</span>
        </h1>
        
        <button
          onClick={handleLogout}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            theme === 'dark'
              ? 'bg-gray-800 text-white hover:bg-gray-700'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Logout
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveContent('messages')}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            activeContent === 'messages'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveContent('projects')}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            activeContent === 'projects'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveContent('experiences')}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            activeContent === 'experiences'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Experience
        </button>
        <button
          onClick={() => setActiveContent('skills')}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            activeContent === 'skills'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Skills
        </button>
        <button
          onClick={() => setActiveContent('certificates')}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            activeContent === 'certificates'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Certificates
        </button>
        <button
          onClick={() => setActiveContent('cv')}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            activeContent === 'cv'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          CV
        </button>
        <button
          onClick={() => setActiveContent('testimonials')}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            activeContent === 'testimonials'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Testimonials
        </button>
        <button
          onClick={() => setActiveContent('achievements')}
          className={`px-4 py-2 rounded-md transition-colors duration-300 ${
            activeContent === 'achievements'
              ? 'bg-blue-600 text-white'
              : theme === 'dark'
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Achievements
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader size={24} className="animate-spin text-blue-600" />
        </div>
      ) : (
        <div>
          {/* Messages Section */}
          {activeContent === 'messages' && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <p className={`text-center py-12 ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  No messages yet.
                </p>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg shadow-md ${
                      !message.read
                        ? theme === 'dark'
                          ? 'bg-blue-900/20 border-l-4 border-blue-600'
                          : 'bg-blue-50 border-l-4 border-blue-600'
                        : theme === 'dark'
                          ? 'bg-gray-900'
                          : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold">{message.name}</h3>
                        <a
                          href={`mailto:${message.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {message.email}
                        </a>
                      </div>
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    
                    <p className={`mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {message.message}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      {!message.read && (
                        <button
                          onClick={() => markAsRead(message.id)}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete('contact_messages', message.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Projects Section */}
          {activeContent === 'projects' && (
            <div>
              <form onSubmit={handleProjectSubmit} className="mb-8 space-y-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={projectForm.image_url}
                    onChange={(e) => setProjectForm({ ...projectForm, image_url: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Project Link
                  </label>
                  <input
                    type="url"
                    value={projectForm.link}
                    onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  {editingId ? 'Update Project' : 'Add Project'}
                </button>
              </form>
              
              <div className="space-y-4">
                {projects.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg shadow-md ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{project.title}</h3>
                        <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`text-xs px-2 py-1 rounded-full ${
                                theme === 'dark'
                                  ? 'bg-gray-800 text-gray-300'
                                  : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setProjectForm({
                              title: project.title,
                              description: project.description,
                              image_url: project.image_url,
                              tags: project.tags.join(', '),
                              link: project.link
                            });
                            setEditingId(project.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-600/10 rounded-full"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('projects', project.id)}
                          className="p-2 text-red-600 hover:bg-red-600/10 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Experience Section */}
          {activeContent === 'experiences' && (
            <div>
              <form onSubmit={handleExperienceSubmit} className="mb-8 space-y-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Position
                  </label>
                  <input
                    type="text"
                    value={experienceForm.position}
                    onChange={(e) => setExperienceForm({ ...experienceForm, position: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Organization
                  </label>
                  <input
                    type="text"
                    value={experienceForm.organization}
                    onChange={(e) => setExperienceForm({ ...experienceForm, organization: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Start Date
                    </label>
                    <DatePicker
                      selected={experienceForm.start_date}
                      onChange={(date: Date | null) => setExperienceForm({ ...experienceForm, start_date: date })}
                      dateFormat="yyyy-MM-dd"
                      className={`w-full p-3 rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-900'
                      } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                      placeholderText="YYYY-MM-DD"
                      required
                      isClearable
                    />
                  </div>
                  
                  <div>
                    <label className={`block mb-2 text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      End Date
                    </label>
                    <DatePicker
                      selected={experienceForm.end_date}
                      onChange={(date: Date | null) => setExperienceForm({ ...experienceForm, end_date: date })}
                      dateFormat="yyyy-MM-dd"
                      className={`w-full p-3 rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-900'
                      } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                      placeholderText="YYYY-MM-DD"
                      isClearable
                    />
                  </div>
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={experienceForm.description}
                    onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Type
                  </label>
                  <select
                    value={experienceForm.type}
                    onChange={(e) => setExperienceForm({ ...experienceForm, type: e.target.value as 'work' | 'education' | 'volunteer' })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  >
                    <option value="work">Work</option>
                    <option value="education">Education</option>
                    <option value="volunteer">Volunteer Work</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  {editingId ? 'Update Experience' : 'Add Experience'}
                </button>
              </form>
              
              <div className="space-y-4">
                {experiences.map((experience) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg shadow-md ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{experience.position}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {experience.organization}
                        </p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {new Date(experience.start_date).toLocaleDateString()} - 
                          {experience.end_date 
                            ? new Date(experience.end_date).toLocaleDateString()
                            : 'Present'
                          }
                        </p>
                        <p className={`mt-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {experience.description}
                        </p>
                        <span className={`inline-block mt-2 text-sm px-2 py-1 rounded-full ${
                          experience.type === 'work'
                            ? 'bg-blue-600/20 text-blue-500'
                            : experience.type === 'education'
                              ? 'bg-emerald-600/20 text-emerald-500'
                              : 'bg-teal-600/20 text-teal-500'
                        }`}>
                          {experience.type}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setExperienceForm({
                              position: experience.position,
                              organization: experience.organization,
                              start_date: experience.start_date ? new Date(experience.start_date) : null,
                              end_date: experience.end_date ? new Date(experience.end_date) : null,
                              description: experience.description,
                              type: experience.type
                            });
                            setEditingId(experience.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-600/10 rounded-full"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('experience', experience.id)}
                          className="p-2 text-red-600 hover:bg-red-600/10 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {activeContent === 'skills' && (
            <div>
              <form onSubmit={handleSkillSubmit} className="mb-8 space-y-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Skill Name
                  </label>
                  <input
                    type="text"
                    value={skillForm.name}
                    onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={skillForm.category}
                    onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Level (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skillForm.level}
                    onChange={(e) => setSkillForm({ ...skillForm, level: parseInt(e.target.value) })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  {editingId ? 'Update Skill' : 'Add Skill'}
                </button>
              </form>
              
              <div className="space-y-4">
                {skills.map((skill) => (
                  <motion.div
                    key={skill.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg shadow-md ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{skill.name}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {skill.category}
                        </p>
                        <div className="mt-2 flex items-center">
                          <div className={`w-32 h-2 rounded-full ${
                            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
                          }`}>
                            <div
                              className="h-full rounded-full bg-blue-600"
                              style={{ width: `${skill.level * 20}%` }}
                            />
                          </div>
                          <span className={`ml-2 text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {skill.level}/5
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSkillForm({
                              name: skill.name,
                              category: skill.category,
                              level: skill.level
                            });
                            setEditingId(skill.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-600/10 rounded-full"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('skills', skill.id)}
                          className="p-2 text-red-600 hover:bg-red-600/10 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Certificates Section */}
          {activeContent === 'certificates' && (
            <div>
              <form onSubmit={handleCertificateSubmit} className="mb-8 space-y-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={certificateForm.title}
                    onChange={(e) => setCertificateForm({ ...certificateForm, title: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Issuer
                  </label>
                  <input
                    type="text"
                    value={certificateForm.issuer}
                    onChange={(e) => setCertificateForm({ ...certificateForm, issuer: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={certificateForm.date}
                    onChange={(e) => setCertificateForm({ ...certificateForm, date: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Description
                  </label>
                  <textarea
                    value={certificateForm.description}
                    onChange={(e) => setCertificateForm({ ...certificateForm, description: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={certificateForm.image_url}
                    onChange={(e) => setCertificateForm({ ...certificateForm, image_url: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  {editingId ? 'Update Certificate' : 'Add Certificate'}
                </button>
              </form>
              <div className="space-y-4">
                {certificates.map((certificate) => (
                  <motion.div
                    key={certificate.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg shadow-md ${
                      theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold">{certificate.title}</h3>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {certificate.issuer}
                        </p>
                        <p className={`text-sm ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {new Date(certificate.date).toLocaleDateString()}
                        </p>
                        <p className={`mt-2 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {certificate.description}
                        </p>
                        <img
                          src={certificate.image_url}
                          alt={certificate.title}
                          className="mt-2 w-32 h-20 object-cover rounded"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCertificateForm({
                              title: certificate.title,
                              issuer: certificate.issuer,
                              date: certificate.date,
                              description: certificate.description,
                              image_url: certificate.image_url
                            });
                            setEditingId(certificate.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-600/10 rounded-full"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('certificates', certificate.id)}
                          className="p-2 text-red-600 hover:bg-red-600/10 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CV Section */}
          {activeContent === 'cv' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Manage CV Link</h2>
              <form onSubmit={handleCvLinkSave} className="space-y-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    CV Link (Google Drive, Dropbox, etc.)
                  </label>
                  <input
                    type="url"
                    value={cvLink}
                    onChange={e => setCvLink(e.target.value)}
                    placeholder="https://drive.google.com/file/..."
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                    } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                    required
                  />
                  <p className={`mt-2 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Make sure the link is publicly accessible and allows downloads.
                  </p>
                </div>
                <button
                  type="submit"
                  className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                  disabled={cvLinkLoading}
                >
                  {cvLinkLoading ? 'Saving...' : 'Save Link'}
                </button>
              </form>
              {cvLink && (
                <div className="mt-4">
                  <a 
                    href={cvLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`inline-flex items-center text-blue-600 hover:text-blue-700 ${
                      theme === 'dark' ? 'hover:text-blue-400' : ''
                    }`}
                  >
                    <Download size={16} className="mr-2" />
                    Test Current CV Link
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Testimonials Section */}
          {activeContent === 'testimonials' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Manage Testimonials</h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Review and manage testimonials submitted by users. Only approved testimonials will be displayed on the main page.
                </p>
              </div>

              <div className="space-y-4">
                {testimonials.length === 0 ? (
                  <div className={`text-center py-12 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No testimonials submitted yet.
                  </div>
                ) : (
                  testimonials.map((testimonial) => (
                    <motion.div
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-lg shadow-md ${
                        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            {testimonial.image_url ? (
                              <img
                                src={testimonial.image_url}
                                alt={testimonial.name}
                                className="w-12 h-12 rounded-full object-cover mr-4"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl mr-4">
                                {testimonial.name.charAt(0)}
                              </div>
                            )}
                            <div>
                              <h3 className="font-bold">{testimonial.name}</h3>
                              <p className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {testimonial.position} at {testimonial.company}
                              </p>
                            </div>
                          </div>
                          
                          <p className={`mt-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {testimonial.content}
                          </p>
                          
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                          
                          <div className="flex items-center mt-4 space-x-2">
                            <span className={`inline-block text-sm px-2 py-1 rounded-full ${
                              testimonial.is_approved
                                ? 'bg-green-600/20 text-green-500'
                                : 'bg-yellow-600/20 text-yellow-500'
                            }`}>
                              {testimonial.is_approved ? 'Approved' : 'Pending'}
                            </span>
                            <span className={`text-sm ${
                              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {new Date(testimonial.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setTestimonialForm({
                                name: testimonial.name,
                                position: testimonial.position,
                                company: testimonial.company,
                                content: testimonial.content,
                                rating: testimonial.rating,
                                image_url: testimonial.image_url || '',
                                is_approved: testimonial.is_approved
                              });
                              setEditingId(testimonial.id);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-600/10 rounded-full"
                            title="Edit testimonial"
                          >
                            <Edit size={16} />
                          </button>
                          {!testimonial.is_approved && (
                            <button
                              onClick={() => handleTestimonialApprove(testimonial.id)}
                              className="p-2 text-green-600 hover:bg-green-600/10 rounded-full"
                              title="Approve testimonial"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete('testimonials', testimonial.id)}
                            className="p-2 text-red-600 hover:bg-red-600/10 rounded-full"
                            title="Delete testimonial"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Achievements Section */}
          {activeContent === 'achievements' && (
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Manage Achievements</h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Add, edit, and delete achievements. Only approved achievements will be displayed on the main page.
                </p>
              </div>

              <form onSubmit={handleAchievementSubmit} className="mb-8 space-y-4">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Title *</label>
                  <input
                    type="text"
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Description *</label>
                  <textarea
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm({ ...achievementForm, description: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Date *</label>
                   <DatePicker
                    selected={achievementForm.date}
                    onChange={(date: Date | null) => setAchievementForm({ ...achievementForm, date: date })}
                    dateFormat="yyyy-MM-dd"
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                    placeholderText="YYYY-MM-DD"
                    required
                    isClearable
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Image URL</label>
                  <input
                    type="url"
                    value={achievementForm.image_url}
                    onChange={(e) => setAchievementForm({ ...achievementForm, image_url: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>Awarded By</label>
                  <input
                    type="text"
                    value={achievementForm.awarded_by}
                    onChange={(e) => setAchievementForm({ ...achievementForm, awarded_by: e.target.value })}
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}
                  />
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="achievementApproved"
                    checked={achievementForm.is_approved}
                    onChange={(e) => setAchievementForm({ ...achievementForm, is_approved: e.target.checked })}
                    className={`mr-2 ${
                      theme === 'dark'
                        ? 'text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-600 focus:ring-offset-gray-800'
                        : 'text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-600 focus:ring-offset-gray-200'
                    }`}
                  />
                  <label htmlFor="achievementApproved" className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>Approved</label>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  {editingId ? 'Update Achievement' : 'Add Achievement'}
                </button>
              </form>
              
              <div className="space-y-4">
                {achievements.length === 0 ? (
                  <div className={`text-center py-12 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    No achievements added yet.
                  </div>
                ) : (
                  achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-6 rounded-lg shadow-md ${
                        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className={`font-bold mb-2 ${
                            theme === 'dark' ? 'text-white' : 'text-gray-900'
                          }`}>{achievement.title}</h3>
                          <p className={`text-sm mb-2 ${
                            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {achievement.description}
                          </p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {new Date(achievement.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {achievement.image_url && (
                            <img
                              src={achievement.image_url}
                              alt={achievement.title}
                              className="mt-4 w-32 h-20 object-cover rounded"
                            />
                          )}
                          
                          <div className="flex items-center mt-4 space-x-2">
                            <span className={`inline-block text-sm px-2 py-1 rounded-full ${
                              achievement.is_approved
                                ? 'bg-green-600/20 text-green-500'
                                : 'bg-yellow-600/20 text-yellow-500'
                            }`}>
                              {achievement.is_approved ? 'Approved' : 'Pending'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => {
                              setEditingId(achievement.id);
                              setAchievementForm({
                                title: achievement.title,
                                description: achievement.description,
                                date: achievement.date ? new Date(achievement.date) : null,
                                image_url: achievement.image_url || '',
                                is_approved: achievement.is_approved,
                                awarded_by: achievement.awarded_by || ''
                              });
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-600/10 rounded-full"
                            title="Edit achievement"
                          >
                            <Edit size={16} />
                          </button>
                          {!achievement.is_approved && (
                            <button
                              onClick={() => handleAchievementApprove(achievement.id)}
                              className="p-2 text-green-600 hover:bg-green-600/10 rounded-full"
                              title="Approve achievement"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete('achievements', achievement.id)}
                            className="p-2 text-red-600 hover:bg-red-600/10 rounded-full"
                            title="Delete achievement"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;