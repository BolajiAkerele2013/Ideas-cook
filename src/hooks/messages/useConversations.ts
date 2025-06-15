import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useConversations(filter: 'all' | 'archived' | 'starred' = 'all') {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        let query = supabase
          .from('conversations')
          .select(`
            *,
            participants:conversation_participants!inner(
              user_id,
              last_read_at,
              profiles(username, avatar_url)
            ),
            settings:conversation_settings!inner(
              is_muted,
              is_archived,
              is_starred
            ),
            messages:messages(
              id,
              content,
              created_at,
              sender:profiles!messages_sender_id_fkey(username)
            )
          `)
          .eq('conversation_participants.user_id', user.id)
          .order('updated_at', { ascending: false });

        if (filter === 'archived') {
          query = query.eq('conversation_settings.is_archived', true);
        } else if (filter === 'starred') {
          query = query.eq('conversation_settings.is_starred', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        const processedConversations = data.map((conv) => ({
          ...conv,
          title: conv.title || conv.participants
            .filter((p: any) => p.user_id !== user.id)
            .map((p: any) => p.profiles.username)
            .join(', '),
          last_message: conv.messages[0]?.content,
          unread: conv.messages.some((m: any) => 
            new Date(m.created_at) > new Date(conv.participants.find((p: any) => p.user_id === user.id).last_read_at)
          ),
        }));

        setConversations(processedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();

    // Subscribe to new messages
    const subscription = supabase
      .channel('conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
      }, () => {
        fetchConversations();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, filter]);

  return { conversations, loading };
}