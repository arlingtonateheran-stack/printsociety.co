import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ynfcyfiavijqclxqayzr.supabase.co';
const supabaseKey = 'sb_publishable_fD6rh3Ffi5x7hqk6XOsX5w_8B_uZx6a';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  thumbnail_url: string;
  alt_text: string;
  sort_order: number;
  type: 'image' | 'video';
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}
