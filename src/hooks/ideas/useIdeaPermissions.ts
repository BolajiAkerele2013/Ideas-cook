import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useIdeaPermissions(ideaId: string) {
  const [canWrite, setCanWrite] = useState(false);
  const [canManageFinances, setCanManageFinances] = useState(false);
  const [canEditIdea, setCanEditIdea] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function checkPermissions() {
      if (!user) {
        setCanWrite(false);
        setCanManageFinances(false);
        setCanEditIdea(false);
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
          setCanManageFinances(true);
          setCanEditIdea(true);
          setLoading(false);
          return;
        }

        // Check if user has permission through role
        const { data: member } = await supabase
          .from('idea_members')
          .select('role')
          .eq('idea_id', ideaId)
          .eq('user_id', user.id)
          .single();

        const writeRoles = ['owner', 'equity_owner', 'contractor'];
        const financeRoles = ['owner', 'equity_owner'];
        const editRoles = ['owner', 'equity_owner'];

        setCanWrite(writeRoles.includes(member?.role || ''));
        setCanManageFinances(financeRoles.includes(member?.role || ''));
        setCanEditIdea(editRoles.includes(member?.role || ''));
      } catch (error) {
        setCanWrite(false);
        setCanManageFinances(false);
        setCanEditIdea(false);
      } finally {
        setLoading(false);
      }
    }

    checkPermissions();
  }, [ideaId, user]);

  return { canWrite, canManageFinances, canEditIdea, loading };
}