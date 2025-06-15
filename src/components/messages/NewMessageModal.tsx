import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCreateConversation } from '../../hooks/messages/useCreateConversation';
import { useUserSearch } from '../../hooks/messages/useUserSearch';

interface NewMessageModalProps {
  onClose: () => void;
  onConversationCreated: (conversationId: string) => void;
}

export function NewMessageModal({ onClose, onConversationCreated }: NewMessageModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const { users, loading } = useUserSearch(searchTerm);
  const { createConversation, loading: creating } = useCreateConversation();

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) return;
    
    const conversationId = await createConversation(selectedUsers);
    if (conversationId) {
      onConversationCreated(conversationId);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">New Message</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="users" className="block text-sm font-medium text-gray-700">
              To:
            </label>
            <input
              type="text"
              id="users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {selectedUsers.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedUsers.map((userId) => {
                const user = users.find((u) => u.id === userId);
                return (
                  <span
                    key={userId}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {user?.username}
                    <button
                      onClick={() => handleUserSelect(userId)}
                      className="ml-1 text-indigo-600 hover:text-indigo-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {loading ? (
            <div className="py-4 text-center text-gray-500">
              Loading users...
            </div>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-50 ${
                    selectedUsers.includes(user.id) ? 'bg-indigo-50' : ''
                  }`}
                >
                  {user.username}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedUsers.length === 0 || creating}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}