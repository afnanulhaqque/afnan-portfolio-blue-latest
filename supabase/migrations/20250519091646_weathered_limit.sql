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

-- CV table
CREATE TABLE IF NOT EXISTS cv (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cv ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable read access for all users" ON cv;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON cv;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON cv;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON cv;

-- Create new policies
CREATE POLICY "Enable read access for all users"
  ON cv
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert for authenticated users only"
  ON cv
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
  ON cv
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
  ON cv
  FOR DELETE
  TO authenticated
  USING (true);