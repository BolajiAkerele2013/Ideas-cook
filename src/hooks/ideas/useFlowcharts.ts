import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Flowchart } from '../../types/database';

export function useFlowcharts(ideaId: string) {
  const [flowcharts, setFlowcharts] = useState<Flowchart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFlowcharts = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('flowcharts')
        .select(`
          *,
          profiles:created_by (username)
        `)
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setFlowcharts(
        data?.map((flowchart) => ({
          ...flowchart,
          created_by_name: flowchart.profiles?.username || 'Unknown',
        })) || []
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load flowcharts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlowcharts();
  }, [ideaId]);

  return { flowcharts, loading, error, refresh: fetchFlowcharts };
}