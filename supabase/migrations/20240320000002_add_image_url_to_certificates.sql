-- Add image_url column to certificates table
ALTER TABLE public.certificates
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.certificates;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.certificates;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.certificates;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.certificates;

-- Create new policies
CREATE POLICY "Enable read access for all users"
ON public.certificates
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert certificates with images
CREATE POLICY "Enable insert for authenticated users only"
ON public.certificates
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update certificates with images
CREATE POLICY "Enable update for authenticated users only"
ON public.certificates
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete certificates
CREATE POLICY "Enable delete for authenticated users only"
ON public.certificates
FOR DELETE
TO authenticated
USING (true); 