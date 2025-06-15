import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export function useConversation(id?: string) {
  const [conversation, setConversation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchConversation = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            *,
            participants:conversation_participants(
              user_id,
              profiles(username, avatar_url)
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        setConversation(data);
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [id]);

  return { conversation, loading };
}