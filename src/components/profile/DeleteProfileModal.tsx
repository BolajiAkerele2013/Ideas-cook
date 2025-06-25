import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { useDeleteProfile } from '../../hooks/profile/useDeleteProfile';

interface BlockingIdea {
  id: string;
  name: string;
  role: string;
  equity_percentage?: number;
}

interface DeleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteProfileModal({ isOpen, onClose, onSuccess }: DeleteProfileModalProps) {
  const [step, setStep] = useState<'confirm' | 'blocked' | 'deleting'>('confirm');
  const [blockingIdeas, setBlockingIdeas] = useState<BlockingIdea[]>([]);
  const { deleteProfile, checkDeletionEligibility, loading } = useDeleteProfile();

  if (!isOpen) return null;

  const handleDeleteAttempt = async () => {
    setStep('deleting');
    
    const result = await deleteProfile();
    
    if (result.success) {
      onSuccess();
    } else if (result.blockingIdeas) {
      setBlockingIdeas(result.blockingIdeas);
      setStep('blocked');
    }
  };

  const renderConfirmStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Your Profile</h3>
          <p className="text-sm text-gray-600">This action cannot be undone</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-medium text-red-800 mb-2">Warning: Permanent Deletion</h4>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• Your profile and all personal data will be permanently deleted</li>
          <li>• You will lose access to all ideas and conversations</li>
          <li>• This action cannot be reversed</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleDeleteAttempt}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center space-x-2"
        >
          <Trash2 className="h-4 w-4" />
          <span>{loading ? 'Checking...' : 'Delete Profile'}</span>
        </button>
      </div>
    </div>
  );

  const renderBlockedStep = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-8 w-8 text-amber-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Cannot Delete Profile</h3>
          <p className="text-sm text-gray-600">You have active ownership or equity in ideas</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-medium text-amber-800 mb-3">You must reassign the following before deletion:</h4>
        <div className="space-y-2">
          {blockingIdeas.map((idea) => (
            <div key={idea.id} className="flex items-center justify-between bg-white rounded p-3 border">
              <div>
                <p className="font-medium text-gray-900">{idea.name}</p>
                <p className="text-sm text-gray-600">
                  Role: {idea.role.replace('_', ' ')}
                  {idea.equity_percentage && ` (${idea.equity_percentage}% equity)`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Next Steps:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Transfer ownership to another team member</li>
          <li>• Reassign your equity to other stakeholders</li>
          <li>• Contact idea owners to discuss transition</li>
        </ul>
      </div>

      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Profile Deletion</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6">
          {step === 'confirm' && renderConfirmStep()}
          {step === 'blocked' && renderBlockedStep()}
          {step === 'deleting' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Deleting your profile...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}