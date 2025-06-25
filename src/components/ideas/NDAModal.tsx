import React, { useState } from 'react';
import { FileText, Check, X } from 'lucide-react';
import { useNDA } from '../../hooks/ideas/useNDA';

interface NDAModalProps {
  ideaId: string;
  ideaName: string;
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export function NDAModal({ ideaId, ideaName, isOpen, onAccept, onDecline }: NDAModalProps) {
  const [accepted, setAccepted] = useState(false);
  const { nda, acceptNDA, loading } = useNDA(ideaId);

  if (!isOpen) return null;

  const handleAccept = async () => {
    const result = await acceptNDA();
    if (result.success) {
      onAccept();
    }
  };

  const defaultNDAContent = `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into between the idea owner and the contractor accessing confidential information related to "${ideaName}".

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

By accepting this NDA, you acknowledge that you have read, understood, and agree to be bound by its terms.
  `;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Non-Disclosure Agreement</h2>
          </div>
          <button
            onClick={onDecline}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 font-medium">
              You must accept this NDA to access "{ideaName}" as a contractor.
            </p>
          </div>

          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded border">
              {nda?.content || defaultNDAContent}
            </pre>
          </div>
        </div>

        <div className="border-t p-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="nda-accept"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="nda-accept" className="ml-2 text-sm text-gray-700">
              I have read and agree to the terms of this Non-Disclosure Agreement
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onDecline}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!accepted || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
            >
              <Check className="h-4 w-4" />
              <span>{loading ? 'Accepting...' : 'Accept & Continue'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}