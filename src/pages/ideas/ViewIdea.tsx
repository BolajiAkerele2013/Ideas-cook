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
import { Lock, AlertTriangle } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  // Handle access denied cases
  if (ideaError || !idea) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to view this idea. This could be because:
          </p>
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                The idea doesn't exist or has been deleted
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                You're not a team member of this private idea
              </li>
              <li className="flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                You need to be invited to join this idea
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate('/forum')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
            >
              Browse Forum
            </button>
          </div>
        </div>
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