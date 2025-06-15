import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface TaskActivity {
  id: string;
  description: string;
  created_at: string;
  user: {
    username: string;
    avatar_url?: string;
  };
}

export function useTaskActivity(taskId: string) {
  const [activities, setActivities] = useState<TaskActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('task_activities')
          .select(`
            *,
            user:profiles!task_activities_user_id_fkey (
              username,
              avatar_url
            )
          `)
          .eq('task_id', taskId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setActivities(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [taskId]);

  return { activities, loading, error };
}