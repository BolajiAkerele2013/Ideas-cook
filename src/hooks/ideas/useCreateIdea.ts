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
      // Insert the idea and return its ID
      const { data: ideaInsertData, error: insertError } = await supabase
        .from('ideas')
        .insert([
          {
            creator_id: user.id,
            name: formData.get('name'),
            description: formData.get('description'),
            problem_category: formData.get('problemCategory'),
            solution: formData.get('solution'),
            visibility: formData.get('visibility') === 'true',
          },
        ])
        .select('id');

      if (insertError || !ideaInsertData || ideaInsertData.length === 0) {
        throw insertError || new Error('Idea creation failed');
      }

      const newIdeaId = ideaInsertData[0].id;

      // Insert the creator as a member with 100% equity
      const { error: memberInsertError } = await supabase
        .from('idea_members')
        .insert([
          {
            user_id: user.id,
            idea_id: newIdeaId,
            role: 'owner',
            equity_percentage: 100,
          },
        ]);

      if (memberInsertError) throw memberInsertError;

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