import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TimeEntry = {
  id: string;
  project_id: string;
  description: string;
  start_time: string;
  end_time: string | null;
  created_at: string;
  project?: {
    name: string;
    rate_per_hour?: number;
  };
}; 