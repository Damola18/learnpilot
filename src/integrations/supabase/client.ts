import { createClient } from '@supabase/supabase-js';
import { Database } from './types';
import { env } from '@/lib/env';

const SUPABASE_URL = env.SUPABASE_URL 
// "https://ihbavvuomhlqqrumcqnf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = env.SUPABASE_ANON_KEY
// "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloYmF2dnVvbWhscXFydW1jcW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUyNjY4MjcsImV4cCI6MjA3MDg0MjgyN30.N0EMfSLkB_4WRnv_z96qJ8twwKXA-T2eABLgbFAQY74";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});