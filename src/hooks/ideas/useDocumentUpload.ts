import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface UploadParams {
  file: File;
  name: string;
  category?: string;
}

export function useDocumentUpload(ideaId: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadDocument = async ({ file, name, category }: UploadParams) => {
    if (!user) {
      setError('You must be logged in to upload documents');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${ideaId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('idea_documents')
        .insert([{
          idea_id: ideaId,
          name,
          category,
          file_url: publicUrl,
          file_type: file.type,
          uploaded_by: user.id,
        }]);

      if (insertError) throw insertError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadDocument, loading, error };
}