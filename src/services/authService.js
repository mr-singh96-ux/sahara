import { supabase } from '../lib/supabase';

class AuthService {
  // Sign in with email and password
  async signIn(email, password, role) {
    try {
      const { data, error } = await supabase?.auth?.signInWithPassword({
        email,
        password
      });

      if (error) {
        return { error: { message: error?.message || 'Login failed' } };
      }

      // Verify user role matches
      const { data: profileData, error: profileError } = await supabase
        ?.from('user_profiles')
        ?.select('role')
        ?.eq('id', data?.user?.id)
        ?.single();

      if (profileError || profileData?.role !== role) {
        await supabase?.auth?.signOut();
        return { error: { message: `Invalid credentials for ${role} role` } };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { error: { message: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive.' } };
      }
      return { error: { message: 'Something went wrong. Please try again.' } };
    }
  }

  // Sign up new user
  async signUp(email, password, userData) {
    try {
      const { data, error } = await supabase?.auth?.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name,
            role: userData?.role || 'victim'
          }
        }
      });

      if (error) {
        return { error: { message: error?.message || 'Registration failed' } };
      }

      return { data, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch')) {
        return { error: { message: 'Cannot connect to registration service. Please check your connection.' } };
      }
      return { error: { message: 'Something went wrong. Please try again.' } };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase?.auth?.signOut();
      return { error };
    } catch (error) {
      return { error: { message: 'Sign out failed. Please try again.' } };
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data: { session }, error } = await supabase?.auth?.getSession();
      return { session, error };
    } catch (error) {
      return { session: null, error: { message: 'Session check failed' } };
    }
  }

  // Get user profile
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.select('*')
        ?.eq('id', userId)
        ?.single();

      if (error) {
        return { data: null, error: { message: error?.message || 'Failed to fetch profile' } };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while fetching profile' } };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('user_profiles')
        ?.update(updates)
        ?.eq('id', userId)
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error: { message: error?.message || 'Profile update failed' } };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error while updating profile' } };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase?.auth?.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      return { error: { message: 'Password reset failed. Please try again.' } };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    const { data: { subscription } } = supabase?.auth?.onAuthStateChange(callback);
    return subscription;
  }
}

export const authService = new AuthService();