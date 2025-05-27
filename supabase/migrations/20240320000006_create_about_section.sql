-- Create about_section table
CREATE TABLE IF NOT EXISTS about_section (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert initial content
INSERT INTO about_section (title, content) VALUES (
    'Who am I?',
    'I''m a passionate and driven undergraduate student pursuing a Bachelor of Science in Information Technology at the International Islamic University Islamabad (IIUI). With a strong inclination toward technology, media, and community engagement, I''ve built a diverse portfolio of experience across various domains.

I currently serve as the PR Lead at BlackBox AI – IIUI, where I oversee communication strategies and public relations initiatives. Previously, I held notable roles such as Content Creator, Media Team Lead, and Social Media Strategist at The Computer Science Society – IIUI, and Operational Lead at Microsoft Learn Student Club – IIUI Chapter.

I''ve also contributed to the Hult Prize – IIUI Chapter as its Marketing and Media Lead, co-founder, and Media Team Lead. I''m recognized as an ambassador for multiple prestigious tech platforms and events, including DevCon 25 by Software Society MCS, Connected Pakistan, Air Nexus 25, Tech Fest Gala, and Global Youth Movement Pakistan.'
);

-- Create RLS policies
ALTER TABLE about_section ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON about_section
    FOR SELECT
    USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update" ON about_section
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated'); 