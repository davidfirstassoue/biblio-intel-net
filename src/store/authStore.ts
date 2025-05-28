import { create } from 'zustand';
import { getCurrentUser, signIn, signOut, signUp, updateUserProfile } from '../lib/supabase';

type UserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
};

type AuthState = {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Omit<UserProfile, 'id' | 'email'>>) => Promise<void>;
  loadUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  initialized: false,

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await signUp(email, password);
      if (error) throw error;
      set({ error: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw error;
      
      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata.name || '',
            avatarUrl: data.user.user_metadata.avatar_url || '',
          },
          error: null,
        });
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      const { error } = await signOut();
      if (error) throw error;
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await updateUserProfile({
        name: updates.name,
        avatar_url: updates.avatarUrl,
      });
      
      if (error) throw error;
      
      const user = get().user;
      if (user) {
        set({
          user: {
            ...user,
            ...updates,
          },
        });
      }
      
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  loadUser: async () => {
    set({ isLoading: true });
    try {
      const { user, error } = await getCurrentUser();
      
      if (error) throw error;
      
      if (user) {
        set({
          user: {
            id: user.id,
            email: user.email || '',
            name: user.user_metadata.name || '',
            avatarUrl: user.user_metadata.avatar_url || '',
          },
        });
      }
      
      set({ initialized: true, isLoading: false });
    } catch (error) {
      set({ initialized: true, isLoading: false });
    }
  },
}));