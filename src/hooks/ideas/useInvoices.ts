import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Invoice } from '../../types/database';

export function useInvoices(ideaId: string) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const { data, error: fetchError } = await supabase
          .from('invoices')
          .select('*')
          .eq('idea_id', ideaId)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setInvoices(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invoices');
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, [ideaId]);

  return { invoices, loading, error };
}