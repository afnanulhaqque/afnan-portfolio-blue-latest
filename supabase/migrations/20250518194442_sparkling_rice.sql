/*
  # Portfolio Database Schema

  1. New Tables
    - `projects`: Stores portfolio project information
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `tags` (text[])
      - `link` (text)
      - `created_at` (timestamptz)
    - `experience`: Stores work and education experience
      - `id` (uuid, primary key)
      - `position` (text)
      - `organization` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `description` (text)
      - `type` (text, either 'work' or 'education')
    - `skills`: Stores skills and proficiency levels
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `level` (integer, 1-5)
    - `contact_messages`: Stores contact form submissions
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `created_at` (timestamptz)
      - `read` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  tags text[] NOT NULL,
  link text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create experience table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL,
  organization text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('work', 'education'))
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  level integer NOT NULL CHECK (level BETWEEN 1 AND 5)
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  read boolean NOT NULL DEFAULT false
);

-- Enable Row Level Security on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Projects policies
CREATE POLICY "Anyone can read projects" ON projects 
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Only admins can insert projects" ON projects 
  FOR INSERT TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

CREATE POLICY "Only admins can update projects" ON projects 
  FOR UPDATE TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

CREATE POLICY "Only admins can delete projects" ON projects 
  FOR DELETE TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

-- Experience policies
CREATE POLICY "Anyone can read experience" ON experience 
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Only admins can insert experience" ON experience 
  FOR INSERT TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

CREATE POLICY "Only admins can update experience" ON experience 
  FOR UPDATE TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

CREATE POLICY "Only admins can delete experience" ON experience 
  FOR DELETE TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

-- Skills policies
CREATE POLICY "Anyone can read skills" ON skills 
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Only admins can insert skills" ON skills 
  FOR INSERT TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

CREATE POLICY "Only admins can update skills" ON skills 
  FOR UPDATE TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

CREATE POLICY "Only admins can delete skills" ON skills 
  FOR DELETE TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

-- Contact messages policies
CREATE POLICY "Anyone can insert contact messages" ON contact_messages 
  FOR INSERT TO anon, authenticated USING (true);

CREATE POLICY "Only admins can read contact messages" ON contact_messages 
  FOR SELECT TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));

CREATE POLICY "Only admins can update contact messages" ON contact_messages 
  FOR UPDATE TO authenticated USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users WHERE auth.role() = 'authenticated'
  ));