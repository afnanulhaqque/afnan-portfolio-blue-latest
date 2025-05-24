-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can read projects" ON projects;
DROP POLICY IF EXISTS "Anyone can read experience" ON experience;
DROP POLICY IF EXISTS "Anyone can read skills" ON skills;
DROP POLICY IF EXISTS "Allow authenticated users to manage projects" ON projects;
DROP POLICY IF EXISTS "Allow authenticated users to manage experience" ON experience;
DROP POLICY IF EXISTS "Allow authenticated users to manage skills" ON skills;
DROP POLICY IF EXISTS "Allow authenticated users to manage certificates" ON certificates;

-- Create new policies for public read access
CREATE POLICY "Enable public read access for projects"
    ON projects
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable public read access for experience"
    ON experience
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable public read access for skills"
    ON skills
    FOR SELECT
    TO public
    USING (true);

CREATE POLICY "Enable public read access for certificates"
    ON certificates
    FOR SELECT
    TO public
    USING (true);

-- Create new policies for authenticated users to manage content
CREATE POLICY "Enable authenticated users to manage projects"
    ON projects
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable authenticated users to manage experience"
    ON experience
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable authenticated users to manage skills"
    ON skills
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Enable authenticated users to manage certificates"
    ON certificates
    TO authenticated
    USING (true)
    WITH CHECK (true); 