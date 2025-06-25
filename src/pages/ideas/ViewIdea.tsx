import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdea } from '../../hooks/ideas/useIdea';
import { useAuth } from '../../contexts/AuthContext';
import { useNDA } from '../../hooks/ideas/useNDA';
import { useIdeaMembers } from '../../hooks/ideas/useIdeaMembers';
import { IdeaHeader } from '../../components/ideas/IdeaHeader';
import { IdeaDetails } from '../../components/ideas/IdeaDetails';
import { IdeaMembers } from '../../components/ideas/IdeaMembers';
import { IdeaManagementTabs } from '../../components/ideas/IdeaManagementTabs';
import { NDAModal } from '../../components/ideas/NDAModal';

export function ViewIdea() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { idea, loading: ideaLoading, error: ideaError } = useIdea(id);
  const { members, loading: membersLoading } = useIdeaMembers(id!);
  const { nda, hasAccepted, loading: ndaLoading, refetch } = useNDA(id!);

  // Check if current user is a contractor for this idea
  const userMembership = members?.find(member => member.user_id === user?.id);
  const isContractor = userMembership?.role === 'contractor';
  const needsNDAAcceptance = isContractor && !hasAccepted;

  if (ideaLoading || membersLoading || ndaLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (ideaError || !idea) {
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

  const handleNDAAccept = () => {
    refetch();
  };

  const handleNDADecline = () => {
    navigate('/profile');
  };

  // If user is a contractor and hasn't accepted NDA, show only NDA modal
  if (needsNDAAcceptance) {
    return (
      <NDAModal
        ideaId={idea.id}
        ideaName={idea.name}
        isOpen={true}
        onAccept={handleNDAAccept}
        onDecline={handleNDADecline}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <IdeaHeader idea={idea} />
      
      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <IdeaDetails idea={idea} />
          <IdeaManagementTabs ideaId={idea.id} onUpdate={handleUpdate} />
        </div>
        <div className="md:col-span-1">
          <IdeaMembers ideaId={idea.id} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
}