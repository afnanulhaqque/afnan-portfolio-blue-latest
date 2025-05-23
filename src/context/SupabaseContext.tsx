import React, { createContext, useContext } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types for our database
export type Project = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  tags: string[];
  link: string;
  created_at: string;
};

export type Experience = {
  id: number;
  position: string;
  organization: string;
  start_date: string;
  end_date: string | null;
  description: string;
  type: 'work' | 'education';
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  created_at: string;
  read: boolean;
};

export type Skill = {
  id: number;
  name: string;
  category: string;
  level: number;
};

interface SupabaseContextType {
  supabase: SupabaseClient;
  getProjects: () => Promise<Project[]>;
  getExperience: () => Promise<Experience[]>;
  getSkills: () => Promise<Skill[]>;
  submitContactForm: (name: string, email: string, message: string) => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const SupabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Get all projects
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

  // Get all experience items (work and education)
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

  // Get all skills
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

  // Submit contact form
  const submitContactForm = async (name: string, email: string, message: string): Promise<void> => {
    const { error } = await supabase.from('contact_messages').insert([
      { name, email, message }
    ]);

    if (error) {
      console.error('Error submitting contact form:', error);
      throw new Error('Failed to submit contact form');
    }
  };

  return (
    <SupabaseContext.Provider value={{ 
      supabase, 
      getProjects, 
      getExperience, 
      getSkills, 
      submitContactForm
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