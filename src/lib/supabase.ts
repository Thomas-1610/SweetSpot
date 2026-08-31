import { createClient } from '@supabase/supabase-js';

// These environment variables need to be set in .env.local
// SUPABASE_URL and SUPABASE_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Only create Supabase client if credentials are provided
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Database types
export interface Photo {
  id: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  date: string;
  created_at: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  created_at: string;
  user_id?: string;
}