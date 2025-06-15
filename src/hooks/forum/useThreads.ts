import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Thread {
  id: string;
  title: string;
  category: string;
  creator: {
    username: string;
    avatar_url?: string;
  };
  is_selling: boolean;
  is_seeking_funding: boolean;
  is_seeking_partners: boolean;
  view_count: number;
  comment_count: number;
  created_at: string;
  idea?: {
    id: string;
    name: string;
    problem_category?: string;
  };
}

export function useThreads() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchThreads() {
      try {
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
            ),
            comments:forum_comments (count)
          `)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        setThreads(
          data?.map((thread) => ({
            ...thread,
            comment_count: thread.comments?.[0]?.count || 0,
            idea: thread.idea?.[0]
          })) || []
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load threads');
      } finally {
        setLoading(false);
      }
    }

    fetchThreads();
  }, []);

  return { threads, loading, error };
}