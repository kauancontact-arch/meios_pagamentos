import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';

export function useUserData(userId?: string) {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetchUserData(userId);
  }, [userId]);

  const fetchUserData = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setUserData(data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updates: Partial<User>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      setUserData(data);
      return data;
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  };

  return {
    userData,
    loading,
    updateUserData,
    refetch: () => userId && fetchUserData(userId),
  };
}