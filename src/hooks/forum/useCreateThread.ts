import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import type { ThreadFormData } from '../../components/forum/ThreadForm';

export function useCreateThread() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createThread = async (data: ThreadFormData): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to create a discussion');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('forum_threads').insert([
        {
          creator_id: user.id,
          title: data.title,
          content: data.content,
          category: data.category,
          idea_id: data.ideaId,
          is_selling: data.is_selling,
          is_seeking_funding: data.is_seeking_funding,
          is_seeking_partners: data.is_seeking_partners,
          is_looking_to_invest: data.is_looking_to_invest,
          is_looking_to_buy: data.is_looking_to_buy,
        },
      ]);

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create discussion');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createThread, loading, error };
}