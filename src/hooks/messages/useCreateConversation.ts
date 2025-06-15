import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useCreateConversation() {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const createConversation = async (participantIds: string[]): Promise<string | null> => {
    if (!user) return null;

    setLoading(true);
    try {
      const allParticipants = [...new Set([...participantIds, user.id])];
      
      const { data, error } = await supabase
        .rpc('create_conversation', {
          participant_ids: allParticipants,
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createConversation, loading };
}