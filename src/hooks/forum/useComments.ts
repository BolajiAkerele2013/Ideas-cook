import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Comment {
  id: string;
  content: string;
  creator: {
    username: string;
    avatar_url?: string;
  };
  created_at: string;
}

export function useComments(threadId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    if (!threadId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('forum_comments')
        .select(`
          *,
          creator:profiles!forum_comments_creator_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;
      setComments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [threadId]);

  return { comments, loading, error, refresh: fetchComments };
}