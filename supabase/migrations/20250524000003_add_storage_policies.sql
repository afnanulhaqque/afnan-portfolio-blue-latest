-- Create the certificates_achievements bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates_achievements', 'certificates_achievements', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the certificates_achievements bucket
CREATE POLICY "Allow public read access for certificates_achievements"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificates_achievements');

CREATE POLICY "Allow authenticated users to upload certificates_achievements"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'certificates_achievements');

CREATE POLICY "Allow authenticated users to update certificates_achievements"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'certificates_achievements')
WITH CHECK (bucket_id = 'certificates_achievements');

CREATE POLICY "Allow authenticated users to delete certificates_achievements"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'certificates_achievements'); 