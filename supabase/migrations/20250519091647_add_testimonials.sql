-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    position text NOT NULL,
    company text NOT NULL,
    content text NOT NULL,
    rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    image_url text,
    is_approved boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on testimonials table
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public to insert testimonials
CREATE POLICY "Allow public to insert testimonials"
    ON public.testimonials
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Allow public to read approved testimonials
CREATE POLICY "Allow public to read approved testimonials"
    ON public.testimonials
    FOR SELECT
    TO public
    USING (is_approved = true);

-- Allow authenticated users to manage testimonials
CREATE POLICY "Allow authenticated users to manage testimonials"
    ON public.testimonials
    TO authenticated
    USING (true)
    WITH CHECK (true); 