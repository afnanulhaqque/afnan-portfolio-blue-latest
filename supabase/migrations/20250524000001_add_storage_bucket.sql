-- Create a new storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio_images', 'portfolio_images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the portfolio_images bucket
CREATE POLICY "Allow public read access for portfolio images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio_images');

CREATE POLICY "Allow authenticated users to upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio_images');

CREATE POLICY "Allow authenticated users to update portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio_images')
WITH CHECK (bucket_id = 'portfolio_images');

CREATE POLICY "Allow authenticated users to delete portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio_images'); 