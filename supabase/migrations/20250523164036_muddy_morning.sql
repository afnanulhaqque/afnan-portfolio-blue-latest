/*
  # Add Certificates Table

  1. New Tables
    - `certificates`
      - `id` (uuid, primary key)
      - `title` (text)
      - `issuer` (text)
      - `date` (date)
      - `description` (text)
      - `image_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on certificates table
    - Add policies for authenticated users to manage certificates
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  issuer text NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to manage certificates"
  ON certificates
  TO authenticated
  USING (true)
  WITH CHECK (true);