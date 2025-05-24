-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to read approved achievements" ON public.achievements;
DROP POLICY IF EXISTS "Allow public to read approved testimonials" ON public.testimonials;

-- Create new policies for public read access
CREATE POLICY "Enable public read access for achievements"
    ON public.achievements
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable public read access for testimonials"
    ON public.testimonials
    FOR SELECT
    TO public
    USING (true);

-- Update the public pages to not filter by is_approved
-- Note: This is just a comment to remind us to update the frontend code
-- We need to remove the .eq('is_approved', true) filter from the queries 