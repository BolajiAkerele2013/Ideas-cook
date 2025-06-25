import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AssignRoleParams {
  ideaId: string;
  email: string;
  role: string;
  equityPercentage?: number;
  expiresAt?: string;
  debtAmount?: number;
  debtDate?: string;
  repaymentMode?: string;
  fullRepaymentDate?: string;
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
    debtAmount,
    debtDate,
    repaymentMode,
    fullRepaymentDate,
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
        .select('id, first_name, last_name')
        .eq('username', email)
        .single();

      if (userError || !userData) {
        setError('Recipient not found. Please check the email address.');
        return false;
      }

      if (userData.id === user.id) throw new Error("You cannot assign roles to yourself");

      // Validate debt financier fields if role is debt_financier
      if (role === 'debt_financier') {
        if (!debtAmount || !debtDate || !repaymentMode || !fullRepaymentDate) {
          setError('All debt financier fields are required');
          return false;
        }
      }

      // Check sender permissions
      const { data: senderData, error: senderError } = await supabase
        .from('idea_members')
        .select('equity_percentage, role')
        .eq('idea_id', ideaId)
        .eq('user_id', user.id)
        .single();

      const senderEquity = senderData?.equity_percentage ?? 0;
      const senderRole = senderData?.role ?? '';

      if (!(senderRole === 'owner' || senderRole === 'equity_owner')) {
        throw new Error("You do not have permission to assign roles");
      }

      // Handle equity assignment for equity_owner role
      if (role === 'equity_owner' && equityPercentage) {
        if (!senderEquity || senderEquity <= 0) throw new Error("You don't have any equity to assign");
        if (equityPercentage > senderEquity) throw new Error("You cannot assign more equity than you own");
      }

      // Check if recipient already exists
      const { data: recipient, error: recipientError } = await supabase
        .from('idea_members')
        .select('id, equity_percentage, role')
        .eq('idea_id', ideaId)
        .eq('user_id', userData.id)
        .single();

      if (recipientError && recipientError.code !== 'PGRST116') throw recipientError;

      let updatedEquity = recipient?.equity_percentage ?? 0;

      // Handle equity transfer for equity_owner role
      if (role === 'equity_owner' && equityPercentage) {
        updatedEquity += equityPercentage;
      }

      // Insert or update recipient
      if (recipient) {
        await supabase
          .from('idea_members')
          .update({ 
            role,
            equity_percentage: role === 'equity_owner' ? updatedEquity : recipient.equity_percentage,
            access_expires_at: role === 'contractor' ? expiresAt : null,
          })
          .eq('id', recipient.id);
      } else {
        await supabase
          .from('idea_members')
          .insert([
            {
              idea_id: ideaId,
              user_id: userData.id,
              role,
              equity_percentage: role === 'equity_owner' ? updatedEquity : null,
              access_expires_at: role === 'contractor' ? expiresAt : null,
            },
          ]);
      }

      // Handle debt financier specific logic
      if (role === 'debt_financier') {
        // Add debt record
        const { error: debtError } = await supabase
          .from('debt_records')
          .insert({
            idea_id: ideaId,
            financier_id: userData.id,
            debt_date: debtDate,
            amount: debtAmount,
            repayment_mode: repaymentMode,
            full_repayment_date: fullRepaymentDate
          });

        if (debtError) throw debtError;

        // Add transaction record
        const narration = `Debt added by ${userData.first_name} ${userData.last_name} of debt financier`;
        
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert({
            idea_id: ideaId,
            type: 'income',
            amount: debtAmount,
            description: narration,
            date: debtDate,
            category: 'Debt Financing'
          });

        if (transactionError) throw transactionError;
      }

      // Deduct equity from sender if equity was assigned
      if (role === 'equity_owner' && equityPercentage) {
        const remainingEquity = senderEquity - equityPercentage;
        await supabase
          .from('idea_members')
          .update({ equity_percentage: remainingEquity })
          .eq('idea_id', ideaId)
          .eq('user_id', user.id);
      }

      // Recalculate roles based on equity while preserving non-equity roles
      const { data: members } = await supabase
        .from('idea_members')
        .select('id, user_id, equity_percentage, role')
        .eq('idea_id', ideaId);

      if (members) {
        const maxEquity = Math.max(...(members?.map(m => m.equity_percentage ?? 0) ?? [0]));
        const topHolders = members?.filter(m => m.equity_percentage === maxEquity && maxEquity > 0) ?? [];

        for (const member of members) {
          let newRole = member.role; // Preserve current role by default

          // Only change role if equity dictates a higher role or if current role is equity-based
          if (topHolders.some(h => h.user_id === member.user_id)) {
            newRole = 'owner';
          } else if ((member.equity_percentage ?? 0) > 0) {
            newRole = 'equity_owner';
          } else if (member.role === 'owner' || member.role === 'equity_owner') {
            // Demote from equity-based roles if no equity
            newRole = 'viewer';
          }
          // For contractor, debt_financier, and viewer roles, preserve them unless equity dictates otherwise

          if (newRole !== member.role) {
            await supabase
              .from('idea_members')
              .update({ role: newRole })
              .eq('id', member.id);
          }
        }
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