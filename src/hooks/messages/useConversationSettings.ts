import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useConversationSettings(conversationId?: string) {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!conversationId || !user) return;

    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('conversation_settings')
          .select('*')
          .eq('conversation_id', conversationId)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [conversationId, user]);

  const updateSettings = async (updates: Partial<typeof settings>) => {
    if (!conversationId || !user) return;

    try {
      const { data, error } = await supabase
        .from('conversation_settings')
        .upsert({
          conversation_id: conversationId,
          user_id: user.id,
          ...settings,
          ...updates,
        })
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const toggleMuted = () => updateSettings({ is_muted: !settings?.is_muted });
  const toggleStarred = () => updateSettings({ is_starred: !settings?.is_starred });
  const toggleArchived = () => updateSettings({ is_archived: !settings?.is_archived });

  return {
    settings,
    loading,
    toggleMuted,
    toggleStarred,
    toggleArchived,
  };
}