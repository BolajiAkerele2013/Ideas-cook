import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface SaveFlowchartParams {
  id?: string | null;
  name: string;
  description?: string;
  category: string;
  data: any;
}

export function useFlowchartEditor(ideaId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const saveFlowchart = async ({
    id,
    name,
    description,
    category,
    data,
  }: SaveFlowchartParams): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to save flowcharts');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      if (id) {
        const { error: updateError } = await supabase
          .from('flowcharts')
          .update({
            name,
            description,
            category,
            data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from('flowcharts').insert([
          {
            idea_id: ideaId,
            name,
            description,
            category,
            data,
            created_by: user.id,
          },
        ]);

        if (insertError) throw insertError;
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save flowchart');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { saveFlowchart, loading, error };
}