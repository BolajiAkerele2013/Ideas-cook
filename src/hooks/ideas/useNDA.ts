import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface NDAData {
  id: string;
  content: string;
  updated_at: string;
}

interface NDAAcceptance {
  id: string;
  user_id: string;
  idea_id: string;
  accepted_at: string;
}

export function useNDA(ideaId: string) {
  const [nda, setNda] = useState<NDAData | null>(null);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ideaId) {
      fetchNDA();
      checkAcceptance();
    }
  }, [ideaId]);

  const fetchNDA = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_ndas')
        .select('*')
        .eq('idea_id', ideaId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setNda(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NDA');
    }
  };

  const checkAcceptance = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('nda_acceptances')
        .select('*')
        .eq('idea_id', ideaId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setHasAccepted(!!data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check NDA acceptance');
    } finally {
      setLoading(false);
    }
  };

  const updateNDA = async (content: string) => {
    try {
      const { data, error } = await supabase
        .from('idea_ndas')
        .upsert({
          idea_id: ideaId,
          content,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setNda(data);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update NDA';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const acceptNDA = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('nda_acceptances')
        .insert({
          idea_id: ideaId,
          user_id: user.id,
          accepted_at: new Date().toISOString()
        });

      if (error) throw error;
      setHasAccepted(true);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept NDA';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    nda,
    hasAccepted,
    loading,
    error,
    updateNDA,
    acceptNDA,
    refetch: () => {
      fetchNDA();
      checkAcceptance();
    }
  };
}