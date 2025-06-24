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

      if (userError || !userData) {
        setError('Recipient not found. Please check the email address.');
        return false;
      }

      if (userData.id === user.id) throw new Error("You cannot assign equity to yourself");

      const { data: senderData, error: senderError } = await supabase
        .from('idea_members')
        .select('equity_percentage, role')
        .eq('idea_id', ideaId)
        .eq('user_id', user.id)
        .single();

      const senderEquity = senderData?.equity_percentage ?? 0;
      const senderRole = senderData?.role ?? '';

      if (!(senderRole === 'owner' || senderRole === 'equity_owner')) {
        throw new Error("You do not have permission to assign equity");
      }

      if (!senderEquity || senderEquity <= 0) throw new Error("You don't have any equity to assign");

      const amountToAssign = equityPercentage ?? 0;
      if (amountToAssign > senderEquity) throw new Error("You cannot assign more equity than you own");

      const { data: recipient, error: recipientError } = await supabase
        .from('idea_members')
        .select('id, equity_percentage')
        .eq('idea_id', ideaId)
        .eq('user_id', userData.id)
        .single();

      if (recipientError && recipientError.code !== 'PGRST116') throw recipientError;

      const updatedEquity = (recipient?.equity_percentage ?? 0) + amountToAssign;

      if (recipient) {
        await supabase
          .from('idea_members')
          .update({ equity_percentage: updatedEquity })
          .eq('id', recipient.id);
      } else {
        await supabase
          .from('idea_members')
          .insert([
            {
              idea_id: ideaId,
              user_id: userData.id,
              role,
              equity_percentage: updatedEquity,
              access_expires_at: expiresAt,
            },
          ]);
      }

      // Deduct from sender
      const remainingEquity = senderEquity - amountToAssign;
      await supabase
        .from('idea_members')
        .update({ equity_percentage: remainingEquity })
        .eq('idea_id', ideaId)
        .eq('user_id', user.id);

      // Recalculate roles
      const { data: members } = await supabase
        .from('idea_members')
        .select('id, user_id, equity_percentage')
        .eq('idea_id', ideaId)
        .not('equity_percentage', 'is', null);

      const maxEquity = Math.max(...(members?.map(m => m.equity_percentage ?? 0) ?? [0]));
      const topHolders = members?.filter(m => m.equity_percentage === maxEquity) ?? [];

      for (const member of members ?? []) {
        let newRole = 'viewer';

        if (topHolders.some(h => h.user_id === member.user_id)) {
          newRole = 'owner';
        } else if ((member.equity_percentage ?? 0) > 0) {
          newRole = 'equity_owner';
        }

        await supabase
          .from('idea_members')
          .update({ role: newRole })
          .eq('id', member.id);
      }

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