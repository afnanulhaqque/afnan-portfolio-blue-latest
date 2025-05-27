-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable read access for all users" ON public.certificates;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.certificates;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON public.certificates;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON public.certificates;

-- Enable RLS on certificates table if not already enabled
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create new policies
-- Allow public read access to all certificates
CREATE POLICY "Enable read access for all users"
ON public.certificates
FOR SELECT
TO public
USING (true);

-- Allow authenticated users to insert certificates
CREATE POLICY "Enable insert for authenticated users only"
ON public.certificates
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update certificates
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