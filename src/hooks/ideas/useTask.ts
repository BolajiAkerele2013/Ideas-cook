import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Task } from '../../types/database';

export function useTask(taskId: string) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select(`
          *,
          assigned_to:profiles!tasks_assigned_to_fkey (
            username,
            avatar_url
          ),
          creator:profiles!tasks_created_by_fkey (
            username,
            avatar_url
          )
        `)
        .eq('id', taskId)
        .single();

      if (fetchError) throw fetchError;
      setTask(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (updates: Partial<Task>) => {
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (updateError) throw updateError;
      await fetchTask();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  return { task, loading, error, updateTask, refresh: fetchTask };
}