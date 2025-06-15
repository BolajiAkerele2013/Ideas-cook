import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Star } from 'lucide-react';
import { formatDate } from '../../utils/date';
import type { Conversation } from '../../types/database';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  searchTerm: string;
}

export function ConversationList({ conversations, loading, searchTerm }: ConversationListProps) {
  const { id: activeId } = useParams();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredConversations.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No conversations found
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {filteredConversations.map((conversation) => (
        <Link
          key={conversation.id}
          to={`/messages/${conversation.id}`}
          className={`block px-4 py-3 hover:bg-gray-50 ${
            activeId === conversation.id ? 'bg-indigo-50' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <p
                  className={`text-sm font-medium ${
                    conversation.unread
                      ? 'text-gray-900'
                      : 'text-gray-600'
                  }`}
                >
                  {conversation.title || 'Chat'}
                </p>
                {conversation.is_starred && (
                  <Star className="h-4 w-4 text-yellow-400 ml-1" />
                )}
              </div>
              {conversation.last_message && (
                <p className="mt-1 text-sm text-gray-500 truncate">
                  {conversation.last_message}
                </p>
              )}
            </div>
            <div className="ml-3 flex-shrink-0">
              <span className="text-xs text-gray-500">
                {formatDate(conversation.updated_at)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}