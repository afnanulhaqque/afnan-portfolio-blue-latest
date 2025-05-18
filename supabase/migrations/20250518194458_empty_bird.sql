/*
  # Seed Data for Portfolio Database

  1. Sample Data
    - Projects data with various tech stacks and categories
    - Work and education experience
    - Skills categorized by type
*/

-- Insert sample projects
INSERT INTO projects (title, description, image_url, tags, link, created_at)
VALUES
  (
    'E-Commerce Platform',
    'A full-featured e-commerce platform built with React, Node.js, and MongoDB. Includes user authentication, product management, cart functionality, and payment processing.',
    'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['React', 'Node.js', 'MongoDB', 'Express'],
    'https://github.com/example/ecommerce',
    NOW() - INTERVAL '2 months'
  ),
  (
    'Weather Dashboard',
    'A real-time weather dashboard that provides current and forecasted weather information using the OpenWeatherMap API. Features include location search, favorites, and responsive design.',
    'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['JavaScript', 'API', 'CSS', 'HTML'],
    'https://github.com/example/weather-app',
    NOW() - INTERVAL '4 months'
  ),
  (
    'Task Management App',
    'A Kanban-style task management application built with React and Firebase. Features include drag-and-drop functionality, task assignment, due dates, and real-time updates.',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['React', 'Firebase', 'Tailwind CSS'],
    'https://github.com/example/task-manager',
    NOW() - INTERVAL '6 months'
  ),
  (
    'Social Media Dashboard',
    'A social media analytics dashboard that aggregates data from multiple platforms. Built with Vue.js and Chart.js for data visualization.',
    'https://images.pexels.com/photos/7567432/pexels-photo-7567432.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['Vue.js', 'Chart.js', 'API', 'Bootstrap'],
    'https://github.com/example/social-dash',
    NOW() - INTERVAL '8 months'
  ),
  (
    'Portfolio Website',
    'A responsive portfolio website built with React and Tailwind CSS. Features include dark/light mode, animations, and contact form integration.',
    'https://images.pexels.com/photos/196646/pexels-photo-196646.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['React', 'Tailwind CSS', 'Framer Motion'],
    'https://github.com/example/portfolio',
    NOW() - INTERVAL '1 month'
  ),
  (
    'Fitness Tracker',
    'A mobile fitness tracking application built with React Native. Features include workout planning, progress tracking, and custom exercise creation.',
    'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ARRAY['React Native', 'Firebase', 'Mobile'],
    'https://github.com/example/fitness-app',
    NOW() - INTERVAL '3 months'
  );

-- Insert experience data
INSERT INTO experience (position, organization, start_date, end_date, description, type)
VALUES
  (
    'PR Lead',
    'BlackBox AI – IIUI',
    '2023-06-01',
    NULL,
    'Oversee communication strategies and public relations initiatives. Develop and implement PR campaigns, manage social media presence, and coordinate with cross-functional teams to ensure consistent brand messaging.',
    'work'
  ),
  (
    'Media Team Lead',
    'The Computer Science Society – IIUI',
    '2022-09-01',
    '2023-05-31',
    'Led a team of content creators and graphic designers. Developed content strategy, managed social media channels, and created promotional materials for events and initiatives.',
    'work'
  ),
  (
    'Operational Lead',
    'Microsoft Learn Student Club – IIUI Chapter',
    '2022-01-01',
    '2022-08-31',
    'Managed operational aspects of the club, including event planning, resource allocation, and member engagement. Coordinated with Microsoft representatives and university administration.',
    'work'
  ),
  (
    'Marketing and Media Lead',
    'Hult Prize – IIUI Chapter',
    '2021-09-01',
    '2022-06-30',
    'Developed and executed marketing strategies for Hult Prize events. Created promotional content, managed social media campaigns, and coordinated with participants and judges.',
    'work'
  ),
  (
    'Intern',
    'Revolve AI',
    '2021-06-01',
    '2021-08-31',
    'Worked on Python-based AI projects, collaborated with the development team, and participated in code reviews and documentation.',
    'work'
  ),
  (
    'BS Information Technology',
    'International Islamic University Islamabad',
    '2021-09-01',
    NULL,
    'Pursuing a Bachelor of Science in Information Technology with a focus on software development, database management, and network administration.',
    'education'
  );

-- Insert skills data
INSERT INTO skills (name, category, level)
VALUES
  ('JavaScript', 'programming', 4),
  ('Python', 'programming', 4),
  ('React', 'frontend', 4),
  ('Node.js', 'backend', 3),
  ('HTML/CSS', 'frontend', 5),
  ('SQL', 'database', 3),
  ('MongoDB', 'database', 3),
  ('Git', 'tools', 4),
  ('Tailwind CSS', 'frontend', 4),
  ('Express.js', 'backend', 3),
  ('Firebase', 'backend', 3),
  ('UI/UX Design', 'design', 4),
  ('RESTful APIs', 'backend', 4),
  ('Figma', 'design', 3),
  ('WordPress', 'cms', 4),
  ('SEO', 'marketing', 3),
  ('Social Media Marketing', 'marketing', 5),
  ('Content Creation', 'marketing', 5),
  ('Public Relations', 'marketing', 5),
  ('Project Management', 'soft skills', 4),
  ('Team Leadership', 'soft skills', 4),
  ('Communication', 'soft skills', 5);

-- Insert a sample contact message
INSERT INTO contact_messages (name, email, message, created_at, read)
VALUES
  (
    'John Doe',
    'john@example.com',
    'Hello Afnan, I came across your portfolio and I''m impressed with your work. I''d like to discuss a potential collaboration on a web development project. Please get in touch when convenient.',
    NOW() - INTERVAL '2 days',
    false
  ),
  (
    'Jane Smith',
    'jane@example.com',
    'Hi Afnan, I represent a tech startup and we''re looking for someone with your skill set to join our team. Would you be interested in discussing this opportunity further?',
    NOW() - INTERVAL '5 days',
    true
  );