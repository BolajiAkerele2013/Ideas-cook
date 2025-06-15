import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Document } from '../../types/database';

export function useDocuments(ideaId: string) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, [ideaId]);

  const fetchDocuments = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('idea_documents')
        .select(`
          *,
          profiles:uploaded_by (username)
        `)
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setDocuments(data?.map(doc => ({
        ...doc,
        uploaded_by_name: doc.profiles?.username || 'Unknown'
      })) || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('idea_documents')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      await fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    deleteDocument,
    refresh: fetchDocuments
  };
}