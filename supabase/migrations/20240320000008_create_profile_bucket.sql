-- Create profile storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile', 'profile', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for profile bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile');

CREATE POLICY "Allow authenticated users to upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile'
  AND auth.role() = 'authenticated'
); 