import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { IdeaMember } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';

interface MemberWithProfile extends IdeaMember {
  profile: {
    username: string;
    avatar_url?: string;
  };
}

export function useIdeaMembers(ideaId: string) {
  const [members, setMembers] = useState<MemberWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMembers = useCallback(async () => {
    if (!user) return;
    
    try {
      // First check if user has access to the idea
      const { data: idea, error: ideaError } = await supabase
        .from('ideas')
        .select('creator_id')
        .eq('id', ideaId)
        .single();

      if (ideaError) throw ideaError;

      // Fetch members if user is creator or a member
      const { data, error: membersError } = await supabase
        .from('idea_members')
        .select(`
          id,
          idea_id,
          user_id,
          role,
          equity_percentage,
          access_expires_at,
          profile:profiles (
            username,
            avatar_url
          )
        `)
        .eq('idea_id', ideaId)
        .order('role');

      if (membersError) throw membersError;

      // Add creator as owner if not already in members list
      if (idea.creator_id === user.id && !data?.some(m => m.user_id === user.id)) {
        const { data: creatorProfile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();

        if (creatorProfile) {
          data?.unshift({
            id: 'creator',
            idea_id: ideaId,
            user_id: user.id,
            role: 'owner',
            equity_percentage: 100,
            profile: creatorProfile,
          });
        }
      }

      setMembers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [ideaId, user]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, refresh: fetchMembers };
}