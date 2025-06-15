import React from 'react';

interface MessageReactionsProps {
  reactions: {
    emoji: string;
    count: number;
    users: string[];
  }[];
  isOwn: boolean;
}

export function MessageReactions({ reactions, isOwn }: MessageReactionsProps) {
  return (
    <div
      className={`flex flex-wrap gap-1 mt-1 ${
        isOwn ? 'justify-end' : 'justify-start'
      }`}
    >
      {reactions.map((reaction, index) => (
        <button
          key={index}
          className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <span className="text-sm">{reaction.emoji}</span>
          <span className="ml-1 text-xs text-gray-500">{reaction.count}</span>
        </button>
      ))}
    </div>
  );
}