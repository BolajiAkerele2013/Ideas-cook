import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export function useFlowchartDelete() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFlowchart = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('flowcharts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete flowchart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteFlowchart, loading, error };
}