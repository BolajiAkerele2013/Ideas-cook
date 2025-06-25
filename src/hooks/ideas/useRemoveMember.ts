import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export function useRemoveMember() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMember = async (membershipId: string) => {
    setLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('idea_members')
        .delete()
        .eq('id', membershipId);

      if (deleteError) throw deleteError;

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove member';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    removeMember,
    loading,
    error
  };
}