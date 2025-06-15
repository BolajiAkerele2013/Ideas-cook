import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Task } from '../../types/database';

export function useKanbanTasks(ideaId: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [ideaId]);

  const fetchTasks = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (data: {
    title: string;
    description: string;
    assigned_to?: string;
    due_date?: string;
  }) => {
    try {
      const { error: insertError } = await supabase
        .from('tasks')
        .insert([
          {
            idea_id: ideaId,
            title: data.title,
            description: data.description,
            status: 'Todo',
            assigned_to: data.assigned_to,
            due_date: data.due_date,
          },
        ]);

      if (insertError) throw insertError;
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (taskId: string, newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (updateError) throw updateError;
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
  };
}