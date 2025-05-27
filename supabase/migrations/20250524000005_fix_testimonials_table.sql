-- Drop existing table and policies
DROP TABLE IF EXISTS public.testimonials CASCADE;

-- Recreate testimonials table
CREATE TABLE public.testimonials (
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

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Enable public read access for approved testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Enable public insert access for testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Enable authenticated users to manage testimonials" ON public.testimonials;

-- Create new policies with explicit schema references
CREATE POLICY "Enable public read access for approved testimonials"
    ON public.testimonials
    FOR SELECT
    TO public
    USING (is_approved = true);

CREATE POLICY "Enable public insert access for testimonials"
    ON public.testimonials
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Enable authenticated users to manage testimonials"
    ON public.testimonials
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.testimonials TO authenticated;
GRANT SELECT ON public.testimonials TO anon;
GRANT INSERT ON public.testimonials TO anon; 