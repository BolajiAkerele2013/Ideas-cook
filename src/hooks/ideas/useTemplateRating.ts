import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export function useTemplateRating() {
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    async function fetchUserRatings() {
      const { data } = await supabase
        .from('template_ratings')
        .select('template_id, rating')
        .eq('user_id', user.id);

      if (data) {
        const ratings = data.reduce((acc, { template_id, rating }) => ({
          ...acc,
          [template_id]: rating
        }), {});
        setUserRatings(ratings);
      }
    }

    fetchUserRatings();
  }, [user]);

  const rateTemplate = async (templateId: string, rating: number) => {
    if (!user) return;

    const { error } = await supabase
      .from('template_ratings')
      .upsert({
        template_id: templateId,
        user_id: user.id,
        rating
      });

    if (!error) {
      setUserRatings(prev => ({
        ...prev,
        [templateId]: rating
      }));
    }
  };

  const getUserRating = (templateId: string) => userRatings[templateId];

  return { rateTemplate, getUserRating };
}