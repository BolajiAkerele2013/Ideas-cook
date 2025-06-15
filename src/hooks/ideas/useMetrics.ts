import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface OwnershipData {
  user: string;
  percentage: number;
}

interface FundingData {
  target: number;
  current: number;
  breakdown: {
    category: string;
    amount: number;
  }[];
}

interface TaskData {
  total: number;
  completed: number;
  byStatus: {
    status: string;
    count: number;
  }[];
}

interface Metrics {
  ownership: OwnershipData[];
  funding: FundingData;
  tasks: TaskData;
}

export function useMetrics(ideaId: string) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Fetch ownership data
        const { data: members } = await supabase
          .from('idea_members')
          .select('user_id, equity_percentage, profiles(username)')
          .eq('idea_id', ideaId);

        // Fetch funding data
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('idea_id', ideaId);

        // Fetch task data
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('idea_id', ideaId);

        // Process ownership data
        const ownership = members?.map(member => ({
          user: member.profiles?.username || 'Unknown',
          percentage: member.equity_percentage || 0
        })) || [];

        // Process funding data
        const funding = {
          target: 100000, // This should come from idea settings
          current: transactions?.reduce((sum, t) => 
            sum + (t.type === 'income' ? t.amount : -t.amount), 0) || 0,
          breakdown: transactions?.reduce((acc: any[], t) => {
            const existing = acc.find(x => x.category === t.category);
            if (existing) {
              existing.amount += t.amount;
            } else {
              acc.push({ category: t.category, amount: t.amount });
            }
            return acc;
          }, []) || []
        };

        // Process task data
        const tasksByStatus = tasks?.reduce((acc: any, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {}) || {};

        const taskMetrics = {
          total: tasks?.length || 0,
          completed: tasks?.filter(t => t.status === 'Done').length || 0,
          byStatus: Object.entries(tasksByStatus).map(([status, count]) => ({
            status,
            count: count as number
          }))
        };

        setMetrics({
          ownership,
          funding,
          tasks: taskMetrics
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load metrics');
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, [ideaId]);

  return { metrics, loading, error };
}