import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useCreateComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createComment = async (threadId: string, content: string): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to comment');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('forum_comments').insert([
        {
          thread_id: threadId,
          creator_id: user.id,
          content,
        },
      ]);

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post comment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createComment, loading, error };
}