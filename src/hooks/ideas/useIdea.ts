import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Idea } from '../../types/database';

export function useIdea(id?: string) {
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchIdea() {
      try {
        const { data, error: fetchError } = await supabase
          .from('ideas')
          .select('*')
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        setIdea(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load idea');
      } finally {
        setLoading(false);
      }
    }

    fetchIdea();
  }, [id]);

  return { idea, loading, error };
}