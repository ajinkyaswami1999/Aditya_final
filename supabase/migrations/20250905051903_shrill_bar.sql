/*
  # Add Hero Slides Setting

  1. Settings Update
    - Add hero_slides setting to site_settings table
    - Insert default hero slides data

  2. Data
    - Default hero slider images and content
    - Configurable through admin panel
*/

-- Insert default hero slides setting
INSERT INTO site_settings (setting_key, setting_value) VALUES
  ('hero_slides', '[
    {
      "image": "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg",
      "title": "Modern Architecture",
      "subtitle": "Creating spaces that inspire"
    },
    {
      "image": "https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg",
      "title": "Innovative Design",
      "subtitle": "Where form meets function"
    },
    {
      "image": "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg",
      "title": "Contemporary Living",
      "subtitle": "Redefining residential spaces"
    }
  ]')
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value;