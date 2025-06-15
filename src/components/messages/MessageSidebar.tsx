import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Archive, Star } from 'lucide-react';
import { useConversations } from '../../hooks/messages/useConversations';
import { ConversationList } from './ConversationList';
import { NewMessageModal } from './NewMessageModal';

export function MessageSidebar() {
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'archived' | 'starred'>('all');
  const { conversations, loading } = useConversations(filter);
  const navigate = useNavigate();

  const handleNewConversation = (conversationId: string) => {
    setShowNewMessage(false);
    navigate(`/messages/${conversationId}`);
  };

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowNewMessage(true)}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </button>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-2 text-sm font-medium ${
            filter === 'all'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('starred')}
          className={`flex-1 py-2 text-sm font-medium ${
            filter === 'starred'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Star className="h-4 w-4 mx-auto" />
        </button>
        <button
          onClick={() => setFilter('archived')}
          className={`flex-1 py-2 text-sm font-medium ${
            filter === 'archived'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Archive className="h-4 w-4 mx-auto" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ConversationList
          conversations={conversations}
          loading={loading}
          searchTerm={searchTerm}
        />
      </div>

      {showNewMessage && (
        <NewMessageModal
          onClose={() => setShowNewMessage(false)}
          onConversationCreated={handleNewConversation}
        />
      )}
    </div>
  );
}