/*
  # Complete Database Schema for 26AS Design Studio

  1. New Tables
    - `projects` - Store all project information with images and details
    - `team_members` - Store team member profiles and information
    - `testimonials` - Store client testimonials and reviews
    - `site_settings` - Store site-wide settings like stats, contact info, social links
    - `project_images` - Store multiple images for each project
    - `admin_users` - Store admin user credentials and permissions

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users and public read access where appropriate
    - Admin-only access for management tables
*/

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  location text NOT NULL,
  year text NOT NULL,
  description text NOT NULL,
  details text NOT NULL,
  client text NOT NULL,
  area text NOT NULL,
  duration text NOT NULL,
  featured boolean DEFAULT false,
  main_image text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Project images table (for multiple images per project)
CREATE TABLE IF NOT EXISTS project_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Team members table
CREATE TABLE IF NOT EXISTS team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  bio text,
  image_url text NOT NULL,
  email text,
  linkedin_url text,
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  client_position text NOT NULL,
  testimonial_text text NOT NULL,
  rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site settings table (for stats, contact info, social links)
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions jsonb DEFAULT '{}',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for main content
CREATE POLICY "Public can read projects"
  ON projects
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read project images"
  ON project_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Public can read team members"
  ON team_members
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Public can read testimonials"
  ON testimonials
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Public can read site settings"
  ON site_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Admin-only access for management
CREATE POLICY "Authenticated users can manage projects"
  ON projects
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage project images"
  ON project_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage team members"
  ON team_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage site settings"
  ON site_settings
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage admin users"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('stats', '{"projectsCompleted": 150, "yearsExperience": 12, "happyClients": 200, "successRate": 95}'),
  ('contact_info', '{"address": "123 Design Street, Suite 456, New York, NY 10001", "phone": "+1 (555) 123-4567", "email": "info@26asdesign.com"}'),
  ('social_links', '{"facebook": "https://facebook.com/26asdesign", "instagram": "https://instagram.com/26asdesign", "twitter": "https://twitter.com/26asdesign", "youtube": "https://youtube.com/@26asdesign", "behance": "https://behance.net/26asdesign"}')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert default admin users (passwords should be hashed in production)
INSERT INTO admin_users (username, password_hash, role, permissions) VALUES
  ('superadmin', 'super123', 'super_admin', '{"projects": true, "team": true, "stats": true, "contact": true, "social": true, "users": true}'),
  ('admin', 'admin123', 'admin', '{"projects": true, "team": true, "stats": false, "contact": false, "social": false, "users": false}')
ON CONFLICT (username) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, title, category, location, year, description, details, client, area, duration, featured, main_image) VALUES
  ('1', 'Modern Villa Residence', 'Residential', 'California', '2024', 'A stunning contemporary villa featuring clean lines and sustainable materials.', 'This modern villa represents the pinnacle of contemporary residential design. Featuring floor-to-ceiling windows, an open-plan layout, and sustainable materials throughout, this home seamlessly blends indoor and outdoor living. The design incorporates smart home technology, energy-efficient systems, and locally sourced materials.', 'Johnson Family', '4,500 sq ft', '18 months', true, 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'),
  ('2', 'Corporate Headquarters', 'Commercial', 'New York', '2023', 'State-of-the-art office building designed for maximum productivity and wellness.', 'A revolutionary approach to corporate architecture that prioritizes employee wellbeing and environmental sustainability. The building features advanced HVAC systems, natural lighting optimization, and flexible workspace configurations.', 'Tech Innovations Corp', '25,000 sq ft', '24 months', true, 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg'),
  ('3', 'Luxury Penthouse', 'Residential', 'Miami', '2024', 'High-end apartment with panoramic city views and premium finishes.', 'This luxury penthouse showcases the finest in urban living with breathtaking panoramic views, premium materials, and cutting-edge smart home integration. Every detail has been carefully curated to create an unparalleled living experience.', 'Private Client', '3,200 sq ft', '12 months', true, 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg'),
  ('4', 'Business Complex', 'Commercial', 'Chicago', '2023', 'Multi-use development combining retail, office, and hospitality spaces.', 'A comprehensive mixed-use development that creates a vibrant urban ecosystem. The complex integrates retail, office, and hospitality functions while maintaining architectural coherence and environmental sustainability.', 'Urban Development Group', '50,000 sq ft', '36 months', false, 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg'),
  ('5', 'Eco-Friendly Home', 'Residential', 'Portland', '2024', 'Sustainable family home with solar panels and natural materials.', 'A pioneering example of sustainable residential architecture that achieves net-zero energy consumption. The home features solar panels, rainwater harvesting, natural ventilation systems, and locally sourced materials.', 'Green Living Family', '2,800 sq ft', '15 months', false, 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg'),
  ('6', 'Urban Loft', 'Residential', 'Brooklyn', '2023', 'Industrial-style loft conversion in a historic brick building.', 'A thoughtful conversion of a historic industrial building into a modern urban loft. The design preserves the building''s industrial character while introducing contemporary amenities and sustainable systems.', 'Urban Professional', '1,800 sq ft', '10 months', false, 'https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg')
ON CONFLICT (id) DO NOTHING;

-- Insert project images
INSERT INTO project_images (project_id, image_url, alt_text, sort_order) VALUES
  ('1', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', 'Modern Villa Exterior', 1),
  ('1', 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg', 'Modern Villa Interior', 2),
  ('1', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'Modern Villa Living Room', 3),
  ('2', 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg', 'Corporate Headquarters Exterior', 1),
  ('2', 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg', 'Corporate Headquarters Lobby', 2),
  ('2', 'https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg', 'Corporate Headquarters Office Space', 3),
  ('3', 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg', 'Luxury Penthouse View', 1),
  ('3', 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg', 'Luxury Penthouse Interior', 2),
  ('3', 'https://images.pexels.com/photos/323772/pexels-photo-323772.jpeg', 'Luxury Penthouse Kitchen', 3);

-- Insert sample team members
INSERT INTO team_members (name, position, bio, image_url, email, sort_order) VALUES
  ('Alex Rodriguez', 'Principal Architect', 'Lead architect with over 15 years of experience in sustainable design and urban planning.', 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg', 'alex@26asdesign.com', 1),
  ('Sarah Kim', 'Design Director', 'Creative director specializing in interior design and space optimization for modern living.', 'https://images.pexels.com/photos/3777946/pexels-photo-3777946.jpeg', 'sarah@26asdesign.com', 2),
  ('Michael Chen', 'Project Manager', 'Experienced project manager ensuring timely delivery and quality execution of all projects.', 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg', 'michael@26asdesign.com', 3)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO testimonials (client_name, client_position, testimonial_text, rating) VALUES
  ('Sarah Johnson', 'CEO, Tech Innovations', '26AS Design Studio transformed our office space into a modern, functional workplace that truly reflects our company culture.', 5),
  ('Michael Chen', 'Homeowner', 'The team delivered beyond our expectations. Our new home is a perfect blend of contemporary design and practical living.', 5),
  ('Lisa Rodriguez', 'Hotel Manager', 'Working with 26AS was seamless. They understood our vision and created a space that our guests absolutely love.', 5)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id);
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON testimonials(active);
CREATE INDEX IF NOT EXISTS idx_site_settings_key ON site_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_team_members_updated_at BEFORE UPDATE ON team_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();