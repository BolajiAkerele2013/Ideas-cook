import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useRemoveMember } from '../../hooks/ideas/useRemoveMember';

interface MemberRemovalButtonProps {
  membershipId: string;
  memberName: string;
  memberRole: string;
  canRemove: boolean;
  onRemoved: () => void;
}

export function MemberRemovalButton({ 
  membershipId, 
  memberName, 
  memberRole, 
  canRemove, 
  onRemoved 
}: MemberRemovalButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const { removeMember, loading } = useRemoveMember();

  if (!canRemove) return null;

  const handleRemove = async () => {
    const result = await removeMember(membershipId);
    if (result.success) {
      onRemoved();
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors"
        title={`Remove ${memberName}`}
      >
        <X className="h-3 w-3" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">Remove Team Member</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove <strong>{memberName}</strong> from their {memberRole.replace('_', ' ')} role? 
                This action cannot be undone.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {loading ? 'Removing...' : 'Remove Member'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}