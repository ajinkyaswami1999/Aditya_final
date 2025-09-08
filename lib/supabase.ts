import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = supabaseUrl && supabaseAnonKey && supabaseUrl !== 'https://your-project-id.supabase.co'
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = supabaseUrl && supabaseServiceKey && supabaseUrl !== 'https://your-project-id.supabase.co'
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;
// Database types
export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  details: string;
  client: string;
  area: string;
  duration: string;
  featured: boolean;
  main_image: string;
  created_at: string;
  updated_at: string;
  project_images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  position: string;
  bio?: string;
  image_url: string;
  email?: string;
  linkedin_url?: string;
  sort_order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  client_position: string;
  testimonial_text: string;
  rating: number;
  project_id?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  role: 'admin' | 'super_admin';
  permissions: Record<string, boolean>;
  active: boolean;
  created_at: string;
  updated_at: string;
  last_login?: string;
}

// API functions
export const projectsApi = {
  async getAll(): Promise<Project[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Project | null> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getFeatured(): Promise<Project[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (*)
      `)
      .eq('featured', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('projects')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const projectImagesApi = {
  async create(projectImage: Omit<ProjectImage, 'id' | 'created_at'>): Promise<ProjectImage> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('project_images')
      .insert(projectImage)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { error } = await supabaseAdmin
      .from('project_images')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const teamMembersApi = {
  async getAll(): Promise<TeamMember[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  },

  async create(member: Omit<TeamMember, 'id' | 'created_at' | 'updated_at'>): Promise<TeamMember> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('team_members')
      .insert(member)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, member: Partial<TeamMember>): Promise<TeamMember> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('team_members')
      .update(member)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { error } = await supabaseAdmin
      .from('team_members')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const testimonialsApi = {
  async getAll(): Promise<Testimonial[]> {
    if (!supabase) return [];
    
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async create(testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>): Promise<Testimonial> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert(testimonial)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update(testimonial)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

export const siteSettingsApi = {
  async get(key: string): Promise<any> {
    if (!supabase) return null;
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .single();
    
    if (error) throw error;
    return data?.setting_value;
  },

  async set(key: string, value: any): Promise<void> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { error } = await supabaseAdmin
      .from('site_settings')
      .upsert({
        setting_key: key,
        setting_value: value
      });
    
    if (error) throw error;
  }
};

export const adminUsersApi = {
  async getAll(): Promise<AdminUser[]> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  async authenticate(username: string, password: string): Promise<AdminUser | null> {
    if (!supabaseAdmin) return null;
    
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .eq('active', true)
      .single();
    
    if (error) return null;
    
    // Update last login
    await supabaseAdmin
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);
    
    return data;
  },

  async create(user: Omit<AdminUser, 'id' | 'created_at' | 'updated_at' | 'last_login'>): Promise<AdminUser> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, user: Partial<AdminUser>): Promise<AdminUser> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .update(user)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Admin access required');
    
    const { error } = await supabaseAdmin
      .from('admin_users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};