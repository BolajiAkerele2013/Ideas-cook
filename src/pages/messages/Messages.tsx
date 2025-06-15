import React from 'react';
import { useParams } from 'react-router-dom';
import { MessageLayout } from '../../components/messages/MessageLayout';
import { MessageList } from '../../components/messages/MessageList';
import { MessageComposer } from '../../components/messages/MessageComposer';
import { MessageCircle, Users } from 'lucide-react';

export function Messages() {
  const { id } = useParams();

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <MessageLayout>
        {id ? (
          <>
            <MessageList conversationId={id} />
            <MessageComposer conversationId={id} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Messages
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Connect with your team members and collaborators. Choose a conversation from the sidebar or start a new one to begin chatting.
              </p>
              <div className="flex items-center justify-center text-blue-600">
                <Users className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Real-time collaboration</span>
              </div>
            </div>
          </div>
        )}
      </MessageLayout>
    </div>
  );
}