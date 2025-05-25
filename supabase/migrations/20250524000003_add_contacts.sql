-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    email text NOT NULL,
    message text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on contacts table
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Allow public to insert contacts
CREATE POLICY "Allow public to insert contacts"
    ON public.contacts
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow authenticated users to read contacts
CREATE POLICY "Allow authenticated users to read contacts"
    ON public.contacts
    FOR SELECT
    TO authenticated
    USING (true); 