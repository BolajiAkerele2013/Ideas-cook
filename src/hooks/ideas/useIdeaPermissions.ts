import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useIdeaPermissions(ideaId: string) {
  const [canWrite, setCanWrite] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function checkPermissions() {
      if (!user) {
        setCanWrite(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user is creator
        const { data: idea } = await supabase
          .from('ideas')
          .select('creator_id')
          .eq('id', ideaId)
          .single();

        if (idea?.creator_id === user.id) {
          setCanWrite(true);
          setLoading(false);
          return;
        }

        // Check if user has write permission through role
        const { data: member } = await supabase
          .from('idea_members')
          .select('role')
          .eq('idea_id', ideaId)
          .eq('user_id', user.id)
          .single();

        setCanWrite(
          member?.role === 'owner' ||
          member?.role === 'equity_owner' ||
          member?.role === 'contractor'
        );
      } catch (error) {
        setCanWrite(false);
      } finally {
        setLoading(false);
      }
    }

    checkPermissions();
  }, [ideaId, user]);

  return { canWrite, loading };
}