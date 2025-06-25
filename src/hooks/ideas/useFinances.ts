import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Transaction, Invoice } from '../../types/database';

interface FinanceData {
  transactions: Transaction[];
  invoices: Invoice[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function useFinances(ideaId: string) {
  const [finances, setFinances] = useState<FinanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFinances = async () => {
    try {
      // Fetch transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('idea_id', ideaId)
        .order('date', { ascending: false });

      if (transactionError) throw transactionError;

      // Fetch invoices
      const { data: invoices, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (invoiceError) throw invoiceError;

      // Calculate totals
      const totalIncome = transactions
        ?.filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      const totalExpenses = transactions
        ?.filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

      setFinances({
        transactions: transactions || [],
        invoices: invoices || [],
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinances();
  }, [ideaId]);

  return { finances, loading, error, refresh: fetchFinances };
}