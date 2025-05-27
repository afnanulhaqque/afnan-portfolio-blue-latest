-- Create profile_picture table
CREATE TABLE IF NOT EXISTS profile_picture (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default profile picture
INSERT INTO profile_picture (image_url)
VALUES ('https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');

-- Enable RLS
ALTER TABLE profile_picture ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access"
    ON profile_picture FOR SELECT
    USING (true);

CREATE POLICY "Allow authenticated users to update"
    ON profile_picture FOR UPDATE
    USING (auth.role() = 'authenticated'); 