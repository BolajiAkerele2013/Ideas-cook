import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { BusinessTemplate } from '../../types/templates';

interface RawTemplate {
  id: string;
  name: string;
  description: string;
  category: BusinessTemplate['category'];
  file_url: string;
  average_rating: number;
  total_ratings: number;
  created_at: string;
  updated_at: string;
}

export function useBusinessTemplates() {
  const [templates, setTemplates] = useState<BusinessTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const { data, error: fetchError } = await supabase
          .from('business_templates')
          .select('*')
          .order('name');

        if (fetchError) throw fetchError;
        
        // Transform the raw data to match our frontend types
        const transformedTemplates: BusinessTemplate[] = (data || []).map((template: RawTemplate) => ({
          id: template.id,
          name: template.name,
          description: template.description,
          category: template.category,
          fileUrl: template.file_url,
          averageRating: template.average_rating || 0,
          totalRatings: template.total_ratings || 0,
          createdAt: template.created_at,
          updatedAt: template.updated_at
        }));

        setTemplates(transformedTemplates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setLoading(false);
      }
    }

    fetchTemplates();
  }, []);

  return { templates, loading, error };
}