import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useCreateIdea() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const createIdea = async (formData: FormData): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to create an idea');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from('ideas').insert([
        {
          creator_id: user.id,
          name: formData.get('name'),
          description: formData.get('description'),
          problem_category: formData.get('problemCategory'),
          solution: formData.get('solution'),
          visibility: formData.get('visibility') === 'true',
        },
      ]);

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create idea');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { createIdea, loading, error };
}