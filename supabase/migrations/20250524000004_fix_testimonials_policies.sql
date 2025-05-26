-- Drop existing policies for testimonials
DROP POLICY IF EXISTS "Allow public to insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow public to read approved testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Allow authenticated users to manage testimonials" ON public.testimonials;

-- Create new policies for testimonials
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