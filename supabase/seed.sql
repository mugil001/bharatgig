-- Seed job categories
INSERT INTO job_categories (name, slug, description, icon) VALUES
('Web Development', 'web-development', 'Build websites and web applications', 'Code'),
('Mobile Development', 'mobile-development', 'Create iOS and Android apps', 'Smartphone'),
('Design & Creative', 'design-creative', 'Graphic design, UI/UX, and creative work', 'Palette'),
('Writing & Content', 'writing-content', 'Content writing, copywriting, and editing', 'PenTool'),
('Marketing & Sales', 'marketing-sales', 'Digital marketing and sales services', 'TrendingUp'),
('Data & Analytics', 'data-analytics', 'Data science and analytics', 'BarChart'),
('Video & Animation', 'video-animation', 'Video editing and animation', 'Video'),
('Business & Consulting', 'business-consulting', 'Business consulting and strategy', 'Briefcase'),
('Legal & Finance', 'legal-finance', 'Legal and financial services', 'Scale'),
('Translation', 'translation', 'Translation and localization', 'Languages');

-- Seed subcategories for Web Development
INSERT INTO job_categories (name, slug, description, parent_id) VALUES
('Frontend Development', 'frontend-development', 'React, Vue, Angular development', (SELECT id FROM job_categories WHERE slug = 'web-development')),
('Backend Development', 'backend-development', 'Node.js, Python, PHP development', (SELECT id FROM job_categories WHERE slug = 'web-development')),
('Full Stack Development', 'full-stack-development', 'Complete web application development', (SELECT id FROM job_categories WHERE slug = 'web-development')),
('WordPress Development', 'wordpress-development', 'WordPress themes and plugins', (SELECT id FROM job_categories WHERE slug = 'web-development')),
('E-commerce Development', 'ecommerce-development', 'Online store development', (SELECT id FROM job_categories WHERE slug = 'web-development'));

-- Seed popular skills
INSERT INTO skills (name, category) VALUES
-- Programming Languages
('JavaScript', 'Programming'),
('TypeScript', 'Programming'),
('Python', 'Programming'),
('Java', 'Programming'),
('PHP', 'Programming'),
('Ruby', 'Programming'),
('Go', 'Programming'),
('C++', 'Programming'),
('Swift', 'Programming'),
('Kotlin', 'Programming'),

-- Web Frameworks
('React', 'Web Framework'),
('Next.js', 'Web Framework'),
('Vue.js', 'Web Framework'),
('Angular', 'Web Framework'),
('Node.js', 'Web Framework'),
('Express.js', 'Web Framework'),
('Django', 'Web Framework'),
('Flask', 'Web Framework'),
('Laravel', 'Web Framework'),
('Ruby on Rails', 'Web Framework'),

-- Mobile Development
('React Native', 'Mobile'),
('Flutter', 'Mobile'),
('iOS Development', 'Mobile'),
('Android Development', 'Mobile'),

-- Design
('UI/UX Design', 'Design'),
('Figma', 'Design'),
('Adobe Photoshop', 'Design'),
('Adobe Illustrator', 'Design'),
('Sketch', 'Design'),
('Adobe XD', 'Design'),
('Graphic Design', 'Design'),
('Logo Design', 'Design'),

-- Database
('PostgreSQL', 'Database'),
('MySQL', 'Database'),
('MongoDB', 'Database'),
('Redis', 'Database'),
('Firebase', 'Database'),

-- Cloud & DevOps
('AWS', 'Cloud'),
('Google Cloud', 'Cloud'),
('Azure', 'Cloud'),
('Docker', 'DevOps'),
('Kubernetes', 'DevOps'),
('CI/CD', 'DevOps'),

-- Marketing
('SEO', 'Marketing'),
('Content Marketing', 'Marketing'),
('Social Media Marketing', 'Marketing'),
('Email Marketing', 'Marketing'),
('Google Ads', 'Marketing'),
('Facebook Ads', 'Marketing'),

-- Writing
('Content Writing', 'Writing'),
('Copywriting', 'Writing'),
('Technical Writing', 'Writing'),
('Blog Writing', 'Writing'),

-- Data Science
('Machine Learning', 'Data Science'),
('Data Analysis', 'Data Science'),
('Python Data Science', 'Data Science'),
('TensorFlow', 'Data Science'),
('PyTorch', 'Data Science'),

-- Other
('WordPress', 'CMS'),
('Shopify', 'E-commerce'),
('WooCommerce', 'E-commerce'),
('Video Editing', 'Video'),
('Animation', 'Video'),
('3D Modeling', 'Design'),
('Translation', 'Language'),
('Accounting', 'Finance'),
('Legal Consulting', 'Legal');
