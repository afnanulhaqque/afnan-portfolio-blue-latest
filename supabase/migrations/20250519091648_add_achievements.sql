-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    image_url text,
    is_approved boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    awarded_by text
);

-- Enable Row Level Security on achievements table
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

-- Allow public to insert achievements
CREATE POLICY "Allow public to insert achievements"
    ON public.achievements
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow public to read approved achievements
CREATE POLICY "Allow public to read approved achievements"
    ON public.achievements
    FOR SELECT
    TO public
    USING (is_approved = true);

-- Allow authenticated users to read all achievements
CREATE POLICY "Allow authenticated users to read all achievements"
    ON public.achievements
    FOR SELECT
    TO authenticated
    USING (true);

-- Allow authenticated users to manage achievements
CREATE POLICY "Allow authenticated users to manage achievements"
    ON public.achievements
    TO authenticated
    USING (true)
    WITH CHECK (true); 