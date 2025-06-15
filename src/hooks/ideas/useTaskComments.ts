import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface TaskComment {
  id: string;
  content: string;
  created_at: string;
  creator: {
    username: string;
    avatar_url?: string;
  };
}

export function useTaskComments(taskId: string) {
  const [comments, setComments] = useState<TaskComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchComments = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('task_comments')
        .select(`
          *,
          creator:profiles!task_comments_creator_id_fkey (
            username,
            avatar_url
          )
        `)
        .eq('task_id', taskId)
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
  }, [taskId]);

  const addComment = async (content: string) => {
    if (!user) {
      setError('You must be logged in to comment');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('task_comments')
        .insert([
          {
            task_id: taskId,
            content,
            creator_id: user.id,
          },
        ]);

      if (insertError) throw insertError;
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment');
      throw err;
    }
  };

  return {
    comments,
    loading,
    error,
    addComment,
  };
}