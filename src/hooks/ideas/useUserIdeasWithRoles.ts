import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Idea } from '../../types/database';

interface IdeaWithRole {
  idea: Idea;
  role: string;
  equityPercentage?: number;
}

export function useUserIdeasWithRoles(userId?: string) {
  const [ideasWithRoles, setIdeasWithRoles] = useState<IdeaWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function fetchIdeasWithRoles() {
      try {
        // First fetch ideas where user is the creator
        const { data: creatorData, error: creatorError } = await supabase
          .from('ideas')
          .select('*')
          .eq('creator_id', userId);

        if (creatorError) throw creatorError;

        // Then fetch ideas where user is a member
        const { data: memberData, error: memberError } = await supabase
          .from('idea_members')
          .select(`
            idea_id,
            role,
            equity_percentage,
            ideas (*)
          `)
          .eq('user_id', userId);

        if (memberError) throw memberError;

        // Create a map of creator ideas to avoid duplicates
        const creatorIdeas = new Map(
          (creatorData || []).map(idea => [
            idea.id,
            {
              idea,
              role: 'owner',
              equityPercentage: 100,
            },
          ])
        );

        // Add member ideas, skipping any that are already in creatorIdeas
        (memberData || []).forEach(m => {
          if (m.ideas && !creatorIdeas.has(m.ideas.id)) {
            creatorIdeas.set(m.ideas.id, {
              idea: m.ideas as Idea,
              role: m.role,
              equityPercentage: m.equity_percentage,
            });
          }
        });

        setIdeasWithRoles(Array.from(creatorIdeas.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ideas');
      } finally {
        setLoading(false);
      }
    }

    fetchIdeasWithRoles();
  }, [userId]);

  return { ideasWithRoles, loading, error };
}