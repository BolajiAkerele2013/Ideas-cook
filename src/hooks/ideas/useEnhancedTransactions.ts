import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface TransactionData {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  is_recurring?: boolean;
  attachment_file?: File;
}

export function useEnhancedTransactions(ideaId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addTransaction = async (data: TransactionData) => {
    setLoading(true);
    setError(null);

    try {
      let attachment_url = null;

      // Upload attachment if provided
      if (data.attachment_file) {
        const fileExt = data.attachment_file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `transactions/${ideaId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('transaction-attachments')
          .upload(filePath, data.attachment_file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('transaction-attachments')
          .getPublicUrl(filePath);

        attachment_url = publicUrl;
      }

      // Insert transaction
      const { error: insertError } = await supabase
        .from('transactions')
        .insert({
          idea_id: ideaId,
          type: data.type,
          amount: data.amount,
          description: data.description,
          date: data.date,
          category: data.category,
          is_recurring: data.is_recurring || false,
          attachment_url
        });

      if (insertError) throw insertError;

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add transaction';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    addTransaction,
    loading,
    error
  };
}