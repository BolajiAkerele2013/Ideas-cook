import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Thread {
  id: string;
  title: string;
  content: string;
  category: string;
  creator: {
    username: string;
    avatar_url?: string;
  };
  is_selling: boolean;
  is_seeking_funding: boolean;
  is_seeking_partners: boolean;
  view_count: number;
  created_at: string;
  idea?: {
    id: string;
    name: string;
    problem_category?: string;
  };
}

export function useThread(id?: string) {
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchThread() {
      try {
        // First, increment view count
        await supabase.rpc('increment_thread_views', { thread_id: id });

        // Then fetch thread data
        const { data, error: fetchError } = await supabase
          .from('forum_threads')
          .select(`
            *,
            creator:profiles!forum_threads_creator_id_fkey (
              username,
              avatar_url
            ),
            idea:ideas (
              id,
              name,
              problem_category
            )
          `)
          .eq('id', id)
          .single();

        if (fetchError) throw fetchError;
        
        // Transform the data to match our interface
        const transformedData = {
          ...data,
          idea: data.idea?.[0]
        };
        
        setThread(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load thread');
      } finally {
        setLoading(false);
      }
    }

    fetchThread();
  }, [id]);

  return { thread, loading, error };
}