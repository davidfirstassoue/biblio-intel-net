import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These environment variables would be set after using the "Connect to Supabase" button
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials missing. Please connect to Supabase via the StackBlitz interface.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        name: '',
        avatar_url: '',
      },
    },
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data?.user, error };
}

export async function updateUserProfile(updates: {
  name?: string;
  avatar_url?: string;
}) {
  const { data: userData } = await supabase.auth.getUser();
  
  if (!userData.user) {
    return { error: { message: 'User not authenticated' } };
  }
  
  const { data, error } = await supabase.auth.updateUser({
    data: updates,
  });
  
  return { data, error };
}