import React, { useState } from 'react';
import { UserCircle, Plus } from 'lucide-react';
import { useIdeaMembers } from '../../hooks/ideas/useIdeaMembers';
import { useIdeaPermissions } from '../../hooks/ideas/useIdeaPermissions';
import { RoleAssignment } from './RoleAssignment';
import { MemberRemovalButton } from './MemberRemovalButton';
import { formatRoleLabel } from '../../utils/format';
import { useAuth } from '../../contexts/AuthContext';
import { useIdea } from '../../hooks/ideas/useIdea';

interface IdeaMembersProps {
  ideaId: string;
  onUpdate: () => void;
}

export function IdeaMembers({ ideaId, onUpdate }: IdeaMembersProps) {
  const [showAssign, setShowAssign] = useState(false);
  const { members, loading, error, refresh } = useIdeaMembers(ideaId);
  const { canEditIdea } = useIdeaPermissions(ideaId);
  const { idea } = useIdea(ideaId);
  const { user } = useAuth();
  
  const canManageRoles = user?.id === idea?.creator_id || 
    members?.some(m => m.user_id === user?.id && (m.role === 'owner' || m.role === 'equity_owner'));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load members</p>
      </div>
    );
  }

  const handleMemberRemoved = () => {
    refresh();
    onUpdate();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
          {canEditIdea && (
            <button
              onClick={() => setShowAssign(!showAssign)}
              className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Member
            </button>
          )}
        </div>
        <div className="px-6 py-5">
          {members?.length === 0 ? (
            <p className="text-sm text-gray-500">No team members yet</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {members?.map((member) => (
                <li key={member.id} className="py-4 relative">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {member.profile.avatar_url ? (
                        <img
                          src={member.profile.avatar_url}
                          alt={member.profile.username}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <UserCircle className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {member.profile.username}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {formatRoleLabel(member.role)}
                        </span>
                        {member.equity_percentage && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {member.equity_percentage}% Equity
                          </span>
                        )}
                        {member.access_expires_at && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Expires: {new Date(member.access_expires_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Show removal button for viewers and contractors if user can edit */}
                  {canEditIdea && (member.role === 'viewer' || member.role === 'contractor') && (
                    <MemberRemovalButton
                      membershipId={member.id}
                      memberName={member.profile.username}
                      memberRole={member.role}
                      canRemove={true}
                      onRemoved={handleMemberRemoved}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showAssign && canEditIdea && (
        <RoleAssignment 
          ideaId={ideaId} 
          onAssigned={() => {
            setShowAssign(false);
            refresh();
            onUpdate();
          }} 
        />
      )}
    </div>
  );
}