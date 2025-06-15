import React from 'react';
import { useParams } from 'react-router-dom';
import { MoreVertical, Star, Archive, Bell, BellOff } from 'lucide-react';
import { useConversation } from '../../hooks/messages/useConversation';
import { useConversationSettings } from '../../hooks/messages/useConversationSettings';

export function MessageHeader() {
  const { id } = useParams();
  const { conversation } = useConversation(id);
  const { settings, toggleMuted, toggleStarred, toggleArchived } = useConversationSettings(id);

  if (!conversation) return null;

  return (
    <div className="h-16 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
      <div className="flex items-center">
        <h2 className="text-lg font-medium text-gray-900">
          {conversation.title || 'Chat'}
        </h2>
        <span className="ml-2 text-sm text-gray-500">
          {conversation.participants?.length} participants
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggleMuted}
          className={`p-2 rounded-full hover:bg-gray-100 ${
            settings?.is_muted ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          {settings?.is_muted ? <BellOff className="h-5 w-5" /> : <Bell className="h-5 w-5" />}
        </button>
        <button
          onClick={toggleStarred}
          className={`p-2 rounded-full hover:bg-gray-100 ${
            settings?.is_starred ? 'text-yellow-400' : 'text-gray-400'
          }`}
        >
          <Star className="h-5 w-5" />
        </button>
        <button
          onClick={toggleArchived}
          className={`p-2 rounded-full hover:bg-gray-100 ${
            settings?.is_archived ? 'text-indigo-600' : 'text-gray-400'
          }`}
        >
          <Archive className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}