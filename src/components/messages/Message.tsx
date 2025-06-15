import React, { useState } from 'react';
import { UserCircle, Smile, MoreVertical } from 'lucide-react';
import { formatDate } from '../../utils/date';
import { MessageReactions } from './MessageReactions';
import { MessageAttachments } from './MessageAttachments';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface MessageProps {
  message: {
    id: string;
    content: any;
    sender: {
      username: string;
      avatar_url?: string;
    };
    created_at: string;
    is_edited: boolean;
    attachments: any[];
    reactions: any[];
  };
  isOwn: boolean;
  showAvatar: boolean;
}

export function Message({ message, isOwn, showAvatar }: MessageProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleEmojiSelect = (emoji: any) => {
    // Handle emoji reaction
    setShowEmojiPicker(false);
  };

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
    >
      {!isOwn && showAvatar && (
        <div className="flex-shrink-0 mr-4">
          {message.sender.avatar_url ? (
            <img
              src={message.sender.avatar_url}
              alt={message.sender.username}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <UserCircle className="h-8 w-8 text-gray-400" />
          )}
        </div>
      )}

      <div className={`max-w-[70%] ${isOwn ? 'order-1' : 'order-2'}`}>
        {showAvatar && (
          <div className={`flex items-center mb-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <span className="text-sm font-medium text-gray-900">
              {message.sender.username}
            </span>
            <span className="ml-2 text-xs text-gray-500">
              {formatDate(message.created_at)}
            </span>
            {message.is_edited && (
              <span className="ml-2 text-xs text-gray-500">(edited)</span>
            )}
          </div>
        )}

        <div className="relative group">
          <div
            className={`rounded-lg px-4 py-2 ${
              isOwn
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <div dangerouslySetInnerHTML={{ __html: message.content }} />
            
            {message.attachments?.length > 0 && (
              <MessageAttachments attachments={message.attachments} />
            )}
          </div>

          <div
            className={`absolute top-0 ${
              isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'
            } h-full flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Smile className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          {showEmojiPicker && (
            <div className={`absolute bottom-full mb-2 ${isOwn ? 'right-0' : 'left-0'}`}>
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
              />
            </div>
          )}
        </div>

        {message.reactions?.length > 0 && (
          <MessageReactions
            reactions={message.reactions}
            isOwn={isOwn}
          />
        )}
      </div>
    </div>
  );
}