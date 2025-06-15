import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useMessageComposer(conversationId: string) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const sendMessage = async (content: any) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            conversation_id: conversationId,
            sender_id: user.id,
            content,
          },
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const uploadAttachment = async (file: File) => {
    if (!user) return;

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${conversationId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('message-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(filePath);

      const { error: attachmentError } = await supabase
        .from('message_attachments')
        .insert([
          {
            message_id: null, // Will be updated after message is created
            file_url: publicUrl,
            file_type: file.type,
            file_name: file.name,
            file_size: file.size,
          },
        ]);

      if (attachmentError) throw attachmentError;

      return publicUrl;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, uploadAttachment, loading };
}