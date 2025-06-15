import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface TaskAttachment {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  created_at: string;
}

export function useTaskAttachments(taskId: string) {
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttachments = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('task_attachments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setAttachments(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load attachments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttachments();
  }, [taskId]);

  const uploadAttachment = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${taskId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('task-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('task-attachments')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('task_attachments')
        .insert([
          {
            task_id: taskId,
            file_name: file.name,
            file_type: file.type,
            file_url: publicUrl,
          },
        ]);

      if (insertError) throw insertError;
      await fetchAttachments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload attachment');
      throw err;
    }
  };

  const deleteAttachment = async (attachmentId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('task_attachments')
        .delete()
        .eq('id', attachmentId);

      if (deleteError) throw deleteError;
      await fetchAttachments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete attachment');
      throw err;
    }
  };

  return {
    attachments,
    loading,
    error,
    uploadAttachment,
    deleteAttachment,
  };
}