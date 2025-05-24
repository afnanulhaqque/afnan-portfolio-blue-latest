import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Loader, Download, Check, Star } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, ContactMessage, Project, Experience, Skill, Certificate } from '../context/SupabaseContext';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { validateAndConvertImageUrl } from '../utils/imageUtils';
import { compressImage } from '../utils/imageUtils';

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

interface AchievementForm {
  title: string;
  description: string;
  date: Date | null;
  image_url: string;
  is_approved: boolean;
  awarded_by: string;
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
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementForm, setAchievementForm] = useState<AchievementForm>({
    title: '',
    description: '',
    date: null,
    image_url: '',
    is_approved: false,
    awarded_by: ''
  });

  // Notification state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | ''; isVisible: boolean }>({ message: '', type: '', isVisible: false });

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
  const [certificateForm, setCertificateForm] = useState<{
    title: string;
    issuer: string;
    date: Date | null; // Changed type to Date | null
    description: string;
    image_url: string;
  }>({
    title: '',
    issuer: '',
    date: null, // Initialize as null
    description: '',
    image_url: ''
  });

  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    position: '',
    company: '',
    content: '',
    rating: 5,
    image_url: '',
    is_approved: false
  });

  // Add state for image URLs
  const [imageUrls, setImageUrls] = useState<{[key: string]: string}>({});

  // Function to handle image URL conversion
  const handleImageUrl = async (url: string | undefined): Promise<string> => {
    if (!url) return '';
    if (imageUrls[url]) return imageUrls[url];
    
    try {
      const convertedUrl = await validateAndConvertImageUrl(url);
      setImageUrls(prev => ({ ...prev, [url]: convertedUrl }));
      return convertedUrl;
    } catch (error) {
      console.error('Error converting image URL:', error);
      return url;
    }
  };

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
      const formData = new FormData(e.target as HTMLFormElement);
      const imageFile = formData.get('image') as File;
      let imageUrl = '';

      console.log('Starting project submission...');
      console.log('Form data:', {
        title: formData.get('title'),
        description: formData.get('description'),
        link: formData.get('link'),
        tags: formData.get('tags')
      });

      // If editing and no new image is uploaded, keep the existing image
      if (editingId) {
        const existingProject = projects.find(p => p.id === editingId);
        imageUrl = existingProject?.image_url || '';
      }

      // Only upload new image if a file is selected
      if (imageFile && imageFile.size > 0) {
        console.log('Processing image file:', imageFile.name, imageFile.size);
        try {
          imageUrl = await handleImageUrl(imageFile.name);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw new Error('Failed to upload image: ' + (uploadError as Error).message);
        }
      }

      const projectData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        link: formData.get('link') as string,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()),
        image_url: imageUrl,
        created_at: new Date().toISOString()
      };

      console.log('Submitting project data:', projectData);

      if (editingId) {
        console.log('Updating existing project:', editingId);
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', editingId);
        
        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
      } else {
        console.log('Creating new project');
        const { error } = await supabase
          .from('projects')
          .insert([projectData]);
        
        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
      }

      // Reset form
      setProjectForm({
        title: '',
        description: '',
        image_url: '',
        tags: '',
        link: ''
      });
      setEditingId(null);
      await fetchAllData();
      (e.target as HTMLFormElement).reset();
      setNotification({ message: 'Project saved successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Error saving project:', error);
      setNotification({ message: 'Failed to save project: ' + (error as Error).message, type: 'error', isVisible: true });
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
        const { error } = await supabase
          .from('skills')
          .update(skillForm)
          .eq('id', editingId);
        
        if (error) {
          console.error('Supabase update error (skill):', error);
          throw error; // Throw the error to be caught by the catch block
        }
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([skillForm]);
        
        if (error) {
          console.error('Supabase insert error (skill):', error);
          throw error; // Throw the error to be caught by the catch block
        }
      }

      setSkillForm({ name: '', category: '', level: 1 });
      setEditingId(null);
      fetchAllData();
      setNotification({ message: 'Skill saved successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Error saving skill:', error);
      setNotification({ message: 'Failed to save skill: ' + (error as Error).message, type: 'error', isVisible: true });
    }
  };

  // Handle certificate operations
  const handleCertificateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const imageFile = formData.get('image') as File;
      let imageUrl = '';

      // Get form values, using certificateForm for updates
      const title = editingId ? certificateForm.title : (formData.get('title') as string);
      const issuer = editingId ? certificateForm.issuer : (formData.get('issuer') as string);
      const description = editingId ? certificateForm.description : (formData.get('description') as string);
      const date = certificateForm.date;

      // Validate required fields
      if (!title || !issuer || !description || !date) {
        console.log('Form validation failed:', { title, issuer, description, date });
        throw new Error('Please fill in all required fields');
      }

      if (imageFile && imageFile.size > 0) {
        // Upload the actual file to Supabase storage
        imageUrl = await handleImageUpload(imageFile);
      } else if (editingId) {
        // If no new image, keep the existing one during update
        const existingCertificate = certificates.find(cert => cert.id === editingId);
        imageUrl = existingCertificate?.image_url || '';
      }

      // Format the date before submitting
      const formattedDate = date.toISOString().split('T')[0];

      const certificateData = {
        title,
        issuer,
        date: formattedDate,
        description,
        image_url: imageUrl
      };

      console.log('Submitting certificate data:', certificateData);

      if (editingId) {
        const { error } = await supabase
          .from('certificates')
          .update(certificateData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('certificates')
          .insert([certificateData]);
        if (error) throw error;
      }

      // Reset form
      setCertificateForm({
        title: '',
        issuer: '',
        date: null,
        description: '',
        image_url: ''
      });
      setEditingId(null);
      await fetchAllData();
      (e.target as HTMLFormElement).reset();
      setNotification({ message: 'Certificate saved successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Error saving certificate:', error);
      setNotification({ message: 'Failed to save certificate: ' + (error as Error).message, type: 'error', isVisible: true });
    }
  };

  // Handle testimonial operations
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const imageFile = formData.get('image') as File;
    let imageUrl = '';

    if (imageFile && imageFile.size > 0) {
      imageUrl = await handleImageUrl(imageFile.name);
    }

    const testimonialData = {
      name: formData.get('name') as string,
      position: formData.get('position') as string,
      company: formData.get('company') as string,
      content: formData.get('content') as string,
      rating: parseInt(formData.get('rating') as string),
      image_url: imageUrl,
      is_approved: testimonialForm.is_approved,
      created_at: new Date().toISOString()
    };

    if (editingId) {
      await supabase
        .from('testimonials')
        .update(testimonialData)
        .eq('id', editingId);
    } else {
      await supabase
        .from('testimonials')
        .insert([testimonialData]);
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
    (e.target as HTMLFormElement).reset();
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

  // Handle achievement operations
  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const imageFile = formData.get('image') as File;
      let imageUrl = '';

      // Get form values, using achievementForm for updates
      const title = editingId ? achievementForm.title : (formData.get('title') as string);
      const description = editingId ? achievementForm.description : (formData.get('description') as string);
      const date = achievementForm.date;
      const awarded_by = editingId ? achievementForm.awarded_by : (formData.get('awarded_by') as string);

      // Validate required fields
      if (!title || !description || !date) {
        console.log('Form validation failed:', { title, description, date });
        throw new Error('Please fill in all required fields');
      }

      if (imageFile && imageFile.size > 0) {
        // Upload the actual file to Supabase storage
        imageUrl = await handleImageUpload(imageFile);
      } else if (editingId) {
        // If no new image, keep the existing one during update
        const existingAchievement = achievements.find(ach => ach.id === editingId);
        imageUrl = existingAchievement?.image_url || '';
      }

      // Format the date before submitting
      const formattedDate = date.toISOString().split('T')[0];

      const achievementData = {
        title,
        description,
        date: formattedDate,
        image_url: imageUrl,
        is_approved: achievementForm.is_approved,
        awarded_by: awarded_by || null
      };

      console.log('Submitting achievement data:', achievementData);

      if (editingId) {
        const { error } = await supabase
          .from('achievements')
          .update(achievementData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert([achievementData]);
        if (error) throw error;
      }

      // Reset form
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
      (e.target as HTMLFormElement).reset();
      setNotification({ message: 'Achievement saved successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Error saving achievement:', error);
      setNotification({ message: 'Failed to save achievement: ' + (error as Error).message, type: 'error', isVisible: true });
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

  // Add this new function to delete images from storage
  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      if (!imageUrl) return;

      // Extract the file path from the URL
      const urlParts = imageUrl.split('/');
      const filePath = urlParts.slice(urlParts.indexOf('certificates_achievements') + 1).join('/');

      if (!filePath) {
        console.error('Could not extract file path from URL:', imageUrl);
        return;
      }

      // Delete the file from storage
      const { error } = await supabase.storage
        .from('certificates_achievements')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting image from storage:', error);
        throw error;
      }

      console.log('Successfully deleted image:', filePath);
    } catch (error) {
      console.error('Error in deleteImageFromStorage:', error);
      throw error;
    }
  };

  // Update the handleDelete function to also delete associated images
  const handleDelete = async (table: string, id: string) => {
    try {
      // Get the item before deleting to check for image
      let imageUrl = '';
      if (table === 'certificates') {
        const certificate = certificates.find(cert => cert.id === id);
        imageUrl = certificate?.image_url || '';
      } else if (table === 'achievements') {
        const achievement = achievements.find(ach => ach.id === id);
        imageUrl = achievement?.image_url || '';
      }

      // Delete the record from the database
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error(`Error deleting from ${table}:`, error);
        throw error;
      }

      // If there was an image, delete it from storage
      if (imageUrl) {
        await deleteImageFromStorage(imageUrl);
      }
      
      fetchAllData();
      setNotification({ message: 'Item deleted successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      setNotification({ message: 'Failed to delete item: ' + (error as Error).message, type: 'error', isVisible: true });
    }
  };

  // Add a new function to delete just the image
  const handleDeleteImage = async (table: string, id: string) => {
    try {
      let imageUrl = '';
      let item;

      if (table === 'certificates') {
        item = certificates.find(cert => cert.id === id);
      } else if (table === 'achievements') {
        item = achievements.find(ach => ach.id === id);
      }

      if (!item) {
        throw new Error('Item not found');
      }

      imageUrl = item.image_url || '';

      if (!imageUrl) {
        throw new Error('No image found to delete');
      }

      // Delete the image from storage
      await deleteImageFromStorage(imageUrl);

      // Update the record to remove the image URL
      const { error } = await supabase
        .from(table)
        .update({ image_url: null })
        .eq('id', id);

      if (error) {
        throw error;
      }

      fetchAllData();
      setNotification({ message: 'Image deleted successfully!', type: 'success', isVisible: true });
    } catch (error) {
      console.error('Error deleting image:', error);
      setNotification({ message: 'Failed to delete image: ' + (error as Error).message, type: 'error', isVisible: true });
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
      // Add your CV link saving logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setCvLinkLoading(false);
    } catch (error) {
      console.error('Error saving CV link:', error);
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

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      console.log('Starting image upload...');
      
      // Compress the image before uploading
      const compressedFile = await compressImage(file);
      console.log('Image compressed:', {
        originalSize: file.size,
        compressedSize: compressedFile.size,
        compressionRatio: (compressedFile.size / file.size * 100).toFixed(2) + '%'
      });
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      // Determine the folder based on the active content
      const folder = activeContent === 'certificates' ? 'certificates' : 'achievements';
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('certificates_achievements')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading to Supabase storage:', error);
        throw new Error('Failed to upload image: ' + error.message);
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certificates_achievements')
        .getPublicUrl(filePath);

      console.log('Image upload successful:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in handleImageUpload:', error);
      throw error;
    }
  };

  // Add useEffect to hide notification
  useEffect(() => {
    if (notification.isVisible) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, isVisible: false });
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [notification]);

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
    <div className="pt-20 relative">
      {/* Custom Notification */} 
      {notification.isVisible && (
        <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md shadow-lg z-50 transition-opacity duration-300 ${notification.isVisible ? 'opacity-100' : 'opacity-0'} ${
          notification.type === 'success'
            ? (theme === 'dark' ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800')
            : (theme === 'dark' ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800')
        }`}>
          <p className="font-semibold">{notification.message}</p>
        </div>
      )}

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
                    name="title"
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
                    name="description"
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
                    Project Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  />
                  <p className={`mt-1 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {editingId ? 'Leave empty to keep existing image' : 'Upload a project image (max 5MB, JPG, PNG, GIF, or WebP)'}
                  </p>

                  {/* Display existing image when editing */}
                  {editingId && projects.find(p => p.id === editingId)?.image_url && (
                    <div className="mt-4">
                      <label className={`block mb-2 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Current Image:
                      </label>
                      <img 
                        src={projects.find(p => p.id === editingId)?.image_url}
                        alt="Current Project Image"
                        className="w-32 h-auto rounded-md"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
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
                    name="link"
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
                    Proficiency Level (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
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
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <span className={`ml-2 text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {skill.level}/100
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
                  {/* Use DatePicker component */}
                  <DatePicker
                    selected={certificateForm.date}
                    onChange={(date: Date | null) => setCertificateForm({ ...certificateForm, date: date })}
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
                    Certificate Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  />
                  <p className={`mt-1 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {editingId ? 'Leave empty to keep existing image' : 'Upload a certificate image (max 5MB, JPG, PNG, GIF, or WebP)'}
                  </p>
                   {/* Display existing image when editing */}
                  {editingId && certificates.find(cert => cert.id === editingId)?.image_url && (
                    <div className="mt-4">
                      <label className={`block mb-2 text-sm font-medium ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Current Image:
                      </label>
                      <div className="mt-4 relative w-full max-w-[800px] h-[600px] bg-white rounded-lg overflow-hidden">
                        <img
                          src={imageUrls[certificates.find(cert => cert.id === editingId)?.image_url] || certificates.find(cert => cert.id === editingId)?.image_url}
                          alt={certificates.find(cert => cert.id === editingId)?.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                              } rounded">
                                <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    </div>
                  )}
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
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
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
                        {certificate.image_url && (
                          <div className="mt-4 relative w-full max-w-[800px] h-[600px] bg-white rounded-lg overflow-hidden">
                            <img
                              src={imageUrls[certificate.image_url] || certificate.image_url}
                              alt={certificate.title}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center ${
                                    theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                                  } rounded">
                                    <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => {
                            // When editing, populate the form with existing certificate data
                            setCertificateForm({
                              title: certificate.title,
                              issuer: certificate.issuer,
                              // Convert the date string from Supabase to a Date object for the DatePicker
                              date: certificate.date ? new Date(certificate.date) : null,
                              description: certificate.description,
                              image_url: certificate.image_url
                            });
                            setEditingId(certificate.id);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-600/10 rounded-full"
                          title="Edit certificate"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete('certificates', certificate.id)}
                          className="p-2 text-red-600 hover:bg-red-600/10 rounded-full"
                        >
                          <Trash2 size={16} />
                        </button>
                        {editingId === certificate.id ? (
                          <button
                            onClick={() => handleDeleteImage('certificates', certificate.id)}
                            className="p-2 text-orange-600 hover:bg-orange-600/10 rounded-full"
                            title="Delete image"
                          >
                            <X size={16} />
                          </button>
                        ) : null}
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
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>Manage CV Link</h2>
              <div className={`p-6 rounded-lg shadow-lg ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <form onSubmit={handleCvLinkSave} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      CV Link
                    </label>
                    <input
                      type="text"
                      value={cvLink}
                      onChange={(e) => setCvLink(e.target.value)}
                      className={`mt-1 block w-full rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-300 text-gray-900'
                      } shadow-sm focus:border-blue-500 focus:ring-blue-500`}
                      placeholder="Enter your CV link"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={cvLinkLoading}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
                  >
                    {cvLinkLoading ? 'Saving...' : 'Save CV Link'}
                  </button>
                </form>

                {/* Display existing CV link and test button */}
                {cvLink && (
                  <div className="mt-4">
                     <h3 className={`text-lg font-bold mb-2 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`}>Current CV Link:</h3>
                    <a
                      href={cvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`break-all text-blue-600 hover:underline ${
                        theme === 'dark' ? 'hover:text-blue-400' : ''
                      }`}
                    >
                      {cvLink}
                    </a>
                     <a
                      href={cvLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center text-blue-600 hover:text-blue-700 mt-2 ${
                        theme === 'dark' ? 'hover:text-blue-400' : ''
                      }`}
                    >
                      <Download size={16} className="mr-2" />
                      Test Current CV Link
                    </a>
                  </div>
                )}
              </div>
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
                                src={imageUrls[testimonial.image_url] || testimonial.image_url}
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
                
                <div>
                  <label className={`block mb-2 text-sm font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Achievement Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    className={`w-full p-3 rounded-md ${
                      theme === 'dark'
                        ? 'bg-gray-800 text-white'
                        : 'bg-white text-gray-900'
                    } border ${
                      theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                    }`}
                  />
                  <p className={`mt-1 text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Upload an achievement image (max 5MB, JPG, PNG, GIF, or WebP)
                  </p>
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
                          <h3 className="font-bold">{achievement.title}</h3>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {achievement.description}
                          </p>
                          <p className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                          {achievement.image_url && (
                            <div className="mt-4 relative w-full max-w-[800px] h-[600px] bg-white rounded-lg overflow-hidden">
                              <img
                                src={achievement.image_url ? (imageUrls[achievement.image_url as string] || achievement.image_url) : ''}
                                alt={achievement.title}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  target.parentElement!.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center ${
                                      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                                    } rounded">
                                      <svg class="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                    </div>
                                  `;
                                }}
                              />
                            </div>
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
                              setAchievementForm({
                                title: achievement.title,
                                description: achievement.description,
                                date: new Date(achievement.date),
                                image_url: achievement.image_url || '',
                                is_approved: achievement.is_approved,
                                awarded_by: achievement.awarded_by || ''
                              });
                              setEditingId(achievement.id);
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
                          {editingId === achievement.id ? (
                            <button
                              onClick={() => handleDeleteImage('achievements', achievement.id)}
                              className="p-2 text-orange-600 hover:bg-orange-600/10 rounded-full"
                              title="Delete image"
                            >
                              <X size={16} />
                            </button>
                          ) : null}
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