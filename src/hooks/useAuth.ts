import { useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export function useAuth() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      } else {
        console.log('Initial session:', session ? 'Found' : 'None');
      }
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session, error) => {
        console.log('Auth state change:', event, session ? 'Session exists' : 'No session');
        if (error) {
          console.error('Auth state change error:', error);
        }
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error('Sign in error:', error);
      throw error;
    }
    console.log('Sign in successful');
    return data;
  };

  const signUp = async (email: string, password: string, options?: { firstName?: string; lastName?: string }) => {
    console.log('Attempting sign up for:', email);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: options?.firstName,
          last_name: options?.lastName,
        }
      }
    });
    if (error) {
      console.error('Sign up error:', error);
      throw error;
    }
    console.log('Sign up successful');
    return data;
  };

  const signOut = async () => {
    console.log('Attempting sign out');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
      throw error;
    }
    console.log('Sign out successful');
  };

  const resendConfirmation = async (email: string) => {
    console.log('Resending confirmation for:', email);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    });
    if (error) {
      console.error('Resend confirmation error:', error);
      throw error;
    }
    console.log('Confirmation email resent');
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resendConfirmation,
  };
}