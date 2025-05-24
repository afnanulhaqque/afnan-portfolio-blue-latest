import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Save, X, Loader, Download } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useSupabase, ContactMessage, Project, Experience, Skill, Certificate } from '../context/SupabaseContext';

type ContentType = 'messages' | 'projects' | 'experiences' | 'skills' | 'certificates' | 'cv';

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

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    image_url: '',
    tags: '',
    link: ''
  });
  const [experienceForm, setExperienceForm] = useState({
    position: '',
    organization: '',
    start_date: '',
    end_date: '',
    description: '',
    type: 'work' as 'work' | 'education' | 'volunteer'
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
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(messagesData || []);

      // Fetch projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      setProjects(projectsData || []);

      // Fetch experiences
      const { data: experiencesData } = await supabase
        .from('experience')
        .select('*')
        .order('start_date', { ascending: false });
      setExperiences(experiencesData || []);

      // Fetch skills
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true });
      setSkills(skillsData || []);

      // Fetch certificates
      const { data: certificatesData } = await supabase
        .from('certificates')
        .select('*')
        .order('date', { ascending: false });
      setCertificates(certificatesData || []);
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
      if (editingId) {
        await supabase
          .from('experience')
          .update(experienceForm)
          .eq('id', editingId);
      } else {
        await supabase
          .from('experience')
          .insert([experienceForm]);
      }

      setExperienceForm({
        position: '',
        organization: '',
        start_date: '',
        end_date: '',
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

  // Handle delete operations
  const handleDelete = async (table: string, id: string) => {
    try {
      await supabase
        .from(table)
        .delete()
        .eq('id', id);
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
                    <input
                      type="date"
                      value={experienceForm.start_date}
                      onChange={(e) => setExperienceForm({ ...experienceForm, start_date: e.target.value })}
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
                      End Date
                    </label>
                    <input
                      type="date"
                      value={experienceForm.end_date}
                      onChange={(e) => setExperienceForm({ ...experienceForm, end_date: e.target.value })}
                      className={`w-full p-3 rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-800 text-white'
                          : 'bg-white text-gray-900'
                      } border ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                      }`}
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
                              start_date: experience.start_date,
                              end_date: experience.end_date || '',
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
        </div>
      )}
    </div>
  );
};

export default Admin;