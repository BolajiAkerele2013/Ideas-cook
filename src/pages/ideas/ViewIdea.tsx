import React from 'react';
import { useParams } from 'react-router-dom';
import { useIdea } from '../../hooks/ideas/useIdea';
import { IdeaHeader } from '../../components/ideas/IdeaHeader';
import { IdeaDetails } from '../../components/ideas/IdeaDetails';
import { IdeaMembers } from '../../components/ideas/IdeaMembers';
import { IdeaManagementTabs } from '../../components/ideas/IdeaManagementTabs';

export function ViewIdea() {
  const { id } = useParams();
  const { idea, loading, error } = useIdea(id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load idea</p>
      </div>
    );
  }

  const handleUpdate = () => {
    // Refresh the idea data if needed
    window.location.reload();
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      <IdeaHeader idea={idea} />
      
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <IdeaDetails idea={idea} />
          <IdeaManagementTabs ideaId={idea.id} onUpdate={handleUpdate} />
        </div>
        <div className="md:col-span-1">
          <IdeaMembers ideaId={idea.id} />
        </div>
      </div>
    </div>
  );
}