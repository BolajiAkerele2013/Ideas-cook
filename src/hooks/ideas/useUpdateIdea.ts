import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useUpdateIdea() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const updateIdea = async (id: string, formData: FormData): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to update an idea');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('ideas')
        .update({
          name: formData.get('name'),
          description: formData.get('description'),
          problem_category: formData.get('problemCategory'),
          solution: formData.get('solution'),
          visibility: formData.get('visibility') === 'true',
        })
        .eq('id', id)
        .eq('creator_id', user.id);

      if (updateError) throw updateError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update idea');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateIdea, loading, error };
}