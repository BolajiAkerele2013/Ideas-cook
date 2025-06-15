import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Idea } from '../../types/database';

export function useUserIdeas(userId?: string) {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchIdeas() {
      try {
        const { data, error: fetchError } = await supabase
          .from('ideas')
          .select('*')
          .eq('creator_id', userId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setIdeas(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ideas');
      } finally {
        setLoading(false);
      }
    }

    fetchIdeas();
  }, [userId]);

  return { ideas, loading, error };
}