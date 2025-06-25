import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface DebtFinancierData {
  user_id: string;
  debt_date: string;
  debt_amount: number;
  repayment_mode: string;
  full_repayment_date: string;
}

export function useDebtFinancier(ideaId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDebtFinancier = async (data: DebtFinancierData) => {
    setLoading(true);
    setError(null);

    try {
      // Get user profile for narration
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', data.user_id)
        .single();

      if (profileError) throw profileError;

      // Add as idea member
      const { error: memberError } = await supabase
        .from('idea_members')
        .insert({
          idea_id: ideaId,
          user_id: data.user_id,
          role: 'debt_financier'
        });

      if (memberError) throw memberError;

      // Add debt record
      const { error: debtError } = await supabase
        .from('debt_records')
        .insert({
          idea_id: ideaId,
          financier_id: data.user_id,
          debt_date: data.debt_date,
          amount: data.debt_amount,
          repayment_mode: data.repayment_mode,
          full_repayment_date: data.full_repayment_date
        });

      if (debtError) throw debtError;

      // Add transaction record
      const narration = `Debt added by ${profile.first_name} ${profile.last_name} of debt financier`;
      
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          idea_id: ideaId,
          type: 'income',
          amount: data.debt_amount,
          description: narration,
          date: data.debt_date,
          category: 'Debt Financing'
        });

      if (transactionError) throw transactionError;

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add debt financier';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    addDebtFinancier,
    loading,
    error
  };
}