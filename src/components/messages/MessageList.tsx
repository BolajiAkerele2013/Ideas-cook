import React, { useRef, useEffect } from 'react';
import { useMessages } from '../../hooks/messages/useMessages';
import { Message } from './Message';
import { useAuth } from '../../contexts/AuthContext';

interface MessageListProps {
  conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
  const { messages, loading } = useMessages(conversationId);
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          isOwn={message.sender_id === user?.id}
          showAvatar={
            index === 0 ||
            messages[index - 1].sender_id !== message.sender_id
          }
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}