import { supabaseAdmin } from './supabase';

export const uploadImage = async (file: File, bucket: string = 'project-images'): Promise<string> => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${bucket}/${fileName}`;

  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    throw error;
  }

  // Get public URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (url: string, bucket: string = 'project-images'): Promise<void> => {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  // Extract file path from URL
  const urlParts = url.split('/');
  const fileName = urlParts[urlParts.length - 1];
  const filePath = `${bucket}/${fileName}`;

  const { error } = await supabaseAdmin.storage
    .from(bucket)
    .remove([filePath]);

  if (error) {
    throw error;
  }
};