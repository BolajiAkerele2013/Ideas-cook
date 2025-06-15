import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AssignRoleParams {
  ideaId: string;
  email: string;
  role: string;
  equityPercentage?: number;
  expiresAt?: string;
}

export function useAssignRole() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const assignRole = async ({
    ideaId,
    email,
    role,
    equityPercentage,
    expiresAt,
  }: AssignRoleParams): Promise<boolean> => {
    if (!user) {
      setError('You must be logged in to assign roles');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // First, get the user ID from the email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', email)
        .single();

      if (userError) throw new Error('User Not found');

      // Check if user is already a member
      const { data: existingMember, error: memberError } = await supabase
        .from('idea_members')
        .select('id')
        .eq('idea_id', ideaId)
        .eq('user_id', userData.id)
        .single();

      if (existingMember) {
        throw new Error('User is already a member of this idea');
      }

      // Add the member
      const { error: insertError } = await supabase
        .from('idea_members')
        .insert([
          {
            idea_id: ideaId,
            user_id: userData.id,
            role,
            equity_percentage: equityPercentage,
            access_expires_at: expiresAt,
          },
        ]);

      if (insertError) throw insertError;
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to assign role');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { assignRole, loading, error };
}