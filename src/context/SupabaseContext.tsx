import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SupabaseClient } from '@supabase/supabase-js'; // Add this import

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  link: string;
  created_at: string;
};

export type Experience = {
  id: string;
  position: string;
  organization: string;
  start_date: string;
  end_date: string | null;
  description: string;
  type: 'work' | 'education' | 'volunteer';
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  level: number;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  date: Date; // Change type from string to Date
  description: string;
  image_url: string;
  created_at: string;
  type: 'event' | 'course';
};

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
  label?: string; // Optional label for custom links like email
}

interface SupabaseContextType {
  supabase: SupabaseClient;
  isAdmin: boolean;
  getProjects: () => Promise<Project[]>;
  getExperience: () => Promise<Experience[]>;
  getSkills: () => Promise<Skill[]>;
  getCertificates: () => Promise<Certificate[]>;
  getCertificate: (id: string) => Promise<Certificate | null>;
  getAbout: () => Promise<any[]>;
  getAboutCached: () => Promise<any[]>;
  submitContactForm: (name: string, email: string, message: string) => Promise<void>;
  getSocialLinks: () => Promise<SocialLink[]>;
  projects: Project[];
  experience: Experience[];
  socialLinks: SocialLink[];
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [aboutCache, setAboutCache] = useState<any | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  useEffect(() => {
    checkAdminStatus();

    const setupRealtimeListeners = () => {
      // Realtime listener for Projects
      const projectChannel = supabase
        .channel('public:projects')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'projects' }, 
          (payload) => {
            console.log('Change received!', payload);
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
              getProjects().then(setProjects);
            }
          }
        )
        .subscribe();

      // Realtime listener for Experience
      const experienceChannel = supabase
        .channel('public:experience')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'experience' }, 
          (payload) => {
            console.log('Experience Change received!', payload);
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
              getExperience().then(setExperience);
            }
          }
        )
        .subscribe();

      // Realtime listener for Social Links
      const socialLinksChannel = supabase
        .channel('public:social_links')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'social_links' }, 
          (payload) => {
            console.log('Social Links Change received!', payload);
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE' || payload.eventType === 'DELETE') {
              getSocialLinks().then(setSocialLinks);
            }
          }
        )
        .subscribe();

      // Initial fetches
      getProjects().then(setProjects);
      getExperience().then(setExperience);
      getSocialLinks().then(setSocialLinks);

      return () => {
        supabase.removeChannel(projectChannel);
        supabase.removeChannel(experienceChannel);
        supabase.removeChannel(socialLinksChannel);
      };
    };

    setupRealtimeListeners();
  }, [supabase]);

  const checkAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      // Use 'profiles' instead of 'users' for is_approved
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('is_approved')
        .eq('id', user.id)
        .limit(1);
      if (error) throw error;
      setIsAdmin(!!(userData && userData[0]?.is_approved));
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const getProjects = async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return data || [];
  };

  const getExperience = async (): Promise<Experience[]> => {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching experience:', error);
      return [];
    }

    return data || [];
  };

  const getSkills = async (): Promise<Skill[]> => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }

    return data || [];
  };

  const getCertificates = async (): Promise<Certificate[]> => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching certificates:', error);
        throw error;
      }

      console.log('Raw certificates data from Supabase:', data);

      const certificates = data.map(cert => ({
        id: cert.id,
        title: cert.title,
        issuer: cert.issuer,
        date: new Date(cert.date),
        description: cert.description,
        type: cert.type || 'event', // Ensure type is set, default to 'event' if missing
        image_url: cert.image_url || '',
        created_at: cert.created_at
      }));

      console.log('Processed certificates:', certificates);
      return certificates;
    } catch (error) {
      console.error('Error in getCertificates:', error);
      throw error;
    }
  };

  const getCertificate = async (id: string): Promise<Certificate | null> => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching certificate:', error);
        throw error;
      }

      if (!data) {
        return null;
      }

      return {
        id: data.id,
        title: data.title,
        issuer: data.issuer,
        date: data.date,
        description: data.description,
        type: data.type || 'event',
        image_url: data.image_url || '',
        created_at: data.created_at
      };
    } catch (error) {
      console.error('Error in getCertificate:', error);
      throw error;
    }
  };

  const getAbout = async (): Promise<any> => {
    try {
      const { data, error } = await supabase
        .from('about_section')
        .select('footer_bio')
        .single();

      if (error) {
        console.error('Error fetching about data:', error);
        throw error;
      }

      setAboutCache(data || null);
      return data || null;
    } catch (error) {
      console.error('Error in getAbout:', error);
      return null;
    }
  };

  const getAboutCached = async (): Promise<any> => {
    if (aboutCache) return aboutCache;
    return await getAbout();
  };

  const submitContactForm = async (name: string, email: string, message: string): Promise<void> => {
    const { error } = await supabase.from('contact_messages').insert([
      { name, email, message }
    ]);

    if (error) {
      console.error('Error submitting contact form:', error);
      throw new Error('Failed to submit contact form');
    }
  };

  const getSocialLinks = async (): Promise<SocialLink[]> => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching social links:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error in getSocialLinks:', error);
      return [];
    }
  };

  return (
    <SupabaseContext.Provider value={{ 
      supabase,
      isAdmin,
      getProjects,
      getExperience,
      getSkills,
      getCertificates,
      getCertificate,
      getAbout,
      getAboutCached,
      submitContactForm,
      getSocialLinks,
      projects,
      experience,
      socialLinks
    }}>
      {children}
    </SupabaseContext.Provider>
  );
};

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within a SupabaseProvider');
  }
  return context;
};