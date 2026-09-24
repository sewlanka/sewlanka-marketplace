import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://rbqwhkvvzlrhmknqaqcx.supabase.co';

const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJicXdoa3Z2emxyaG1rbnFhcWN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNTI2OTEsImV4cCI6MjEwNTgyODY5MX0.SVBIRrmY1ZiXrlEiiIaOCr8CYL2FLI3UZBEOIfKTsw8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // Strictly NO LocalStorage as requested by user!
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export const SUPABASE_CONFIG = {
  projectUrl: SUPABASE_URL,
  storageBucket: 'ad-images',
};
