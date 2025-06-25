import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface BlockingIdea {
  id: string;
  name: string;
  role: string;
  equity_percentage?: number;
}

export function useDeleteProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const checkDeletionEligibility = async (): Promise<{ canDelete: boolean; blockingIdeas: BlockingIdea[] }> => {
    if (!user) throw new Error('User not authenticated');

    const { data: memberships, error: membershipError } = await supabase
      .from('idea_members')
      .select(`
        id,
        role,
        equity_percentage,
        ideas!inner(id, name)
      `)
      .eq('user_id', user.id)
      .in('role', ['owner', 'equity_owner']);

    if (membershipError) throw membershipError;

    const blockingIdeas: BlockingIdea[] = memberships
      .filter(membership => 
        membership.role === 'owner' || 
        (membership.role === 'equity_owner' && membership.equity_percentage && membership.equity_percentage > 0)
      )
      .map(membership => ({
        id: membership.ideas.id,
        name: membership.ideas.name,
        role: membership.role,
        equity_percentage: membership.equity_percentage
      }));

    return {
      canDelete: blockingIdeas.length === 0,
      blockingIdeas
    };
  };

  const deleteProfile = async (): Promise<{ success: boolean; blockingIdeas?: BlockingIdea[] }> => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      // Check eligibility first
      const { canDelete, blockingIdeas } = await checkDeletionEligibility();

      if (!canDelete) {
        return { success: false, blockingIdeas };
      }

      // Delete user profile and related data
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (deleteError) throw deleteError;

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete profile';
      setError(errorMessage);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteProfile,
    checkDeletionEligibility,
    loading,
    error
  };
}