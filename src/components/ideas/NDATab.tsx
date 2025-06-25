import React, { useState } from 'react';
import { FileText, Edit3, Save, X } from 'lucide-react';
import { useNDA } from '../../hooks/ideas/useNDA';

interface NDATabProps {
  ideaId: string;
  canEdit: boolean;
}

export function NDATab({ ideaId, canEdit }: NDATabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const { nda, updateNDA, loading } = useNDA(ideaId);

  const defaultNDAContent = `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into between the idea owner and the contractor accessing confidential information.

1. CONFIDENTIAL INFORMATION
All information, documents, data, and materials related to this idea, including but not limited to business plans, financial information, technical specifications, and strategic plans.

2. OBLIGATIONS
The contractor agrees to:
- Keep all confidential information strictly confidential
- Not disclose any information to third parties
- Use information solely for the purpose of this engagement
- Return or destroy all confidential materials upon request

3. TERM
This agreement remains in effect indefinitely unless terminated by mutual consent.

4. REMEDIES
Breach of this agreement may result in immediate termination and legal action.

By accepting this NDA, you acknowledge that you have read, understood, and agree to be bound by its terms.`;

  const handleEdit = () => {
    setEditContent(nda?.content || defaultNDAContent);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const result = await updateNDA(editContent);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Non-Disclosure Agreement</h3>
        </div>
        
        {canEdit && !isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
          >
            <Edit3 className="h-4 w-4" />
            <span>Edit NDA</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NDA Content
            </label>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={20}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              placeholder="Enter NDA content..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving...' : 'Save NDA'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
            {nda?.content || defaultNDAContent}
          </pre>
          
          {nda?.updated_at && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Last updated: {new Date(nda.updated_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">NDA Enforcement</h4>
        <p className="text-sm text-blue-700">
          All contractors must accept this NDA before accessing idea details. 
          The NDA is automatically presented when contractors attempt to view the idea.
        </p>
      </div>
    </div>
  );
}