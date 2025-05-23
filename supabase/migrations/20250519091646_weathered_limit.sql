/*
  # Initial Schema Setup

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `tags` (text array)
      - `link` (text)
      - `created_at` (timestamp)

    - `experience`
      - `id` (uuid, primary key)
      - `position` (text)
      - `organization` (text)
      - `start_date` (date)
      - `end_date` (date, nullable)
      - `description` (text)
      - `type` (text)
      - `created_at` (timestamp)

    - `skills`
      - `id` (uuid, primary key)
      - `name` (text)
      - `category` (text)
      - `level` (integer)
      - `created_at` (timestamp)

    - `contact_messages`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `message` (text)
      - `read` (boolean)
      - `created_at` (timestamp)

    - `cv`
      - `id` (uuid, primary key)
      - `link` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage content
    - Allow public access to contact_messages for form submissions
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  link text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage projects"
  ON projects
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Experience table
CREATE TABLE IF NOT EXISTS experience (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL,
  organization text NOT NULL,
  start_date date NOT NULL,
  end_date date,
  description text NOT NULL,
  type text NOT NULL CHECK (type IN ('work', 'education')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage experience"
  ON experience
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  level integer NOT NULL CHECK (level BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage skills"
  ON skills
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public submissions to contact_messages
CREATE POLICY "Allow public to insert contact messages"
  ON contact_messages
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow authenticated users to read and update contact messages
CREATE POLICY "Allow authenticated users to manage contact messages"
  ON contact_messages
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create the cv table if it doesn't exist
CREATE TABLE public.cv (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    link text NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT cv_pkey PRIMARY KEY (id)
);

-- Enable Row Level Security on the cv table
ALTER TABLE public.cv ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for cv if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.cv;
DROP POLICY IF EXISTS "Allow authorized users to insert" ON public.cv;
DROP POLICY IF EXISTS "Allow authorized users to update" ON public.cv;
DROP POLICY IF EXISTS "Allow authorized users to delete" ON public.cv;

-- Create a new policy to allow public read access
CREATE POLICY "Enable read access for all users" ON public.cv AS permissive FOR
    SELECT TO public
    USING (true);

-- Optionally, add policies for authenticated users to manage their own data if needed, adjust as per your application's auth logic
-- CREATE POLICY "Allow authorized users to insert" ON public.cv AS permissive FOR
--     INSERT TO authenticated
--     WITH CHECK (true);

-- CREATE POLICY "Allow authorized users to update" ON public.cv AS permissive FOR
--     UPDATE TO authenticated
--     USING (true);

-- CREATE POLICY "Allow authorized users to delete" ON public.cv AS permissive FOR
--     DELETE TO authenticated
--     USING (true);