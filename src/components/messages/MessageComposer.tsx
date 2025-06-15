import React, { useState, useRef } from 'react';
import { Paperclip, Send, Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useMessageComposer } from '../../hooks/messages/useMessageComposer';

interface MessageComposerProps {
  conversationId: string;
}

export function MessageComposer({ conversationId }: MessageComposerProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);
  const { sendMessage, uploadAttachment, loading } = useMessageComposer(conversationId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || loading) return;

    try {
      await sendMessage(message);
      setMessage('');
      if (messageRef.current) {
        messageRef.current.innerHTML = '';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      try {
        const url = await uploadAttachment(files[0]);
        if (url) {
          await sendMessage({
            type: 'attachment',
            url,
            fileName: files[0].name,
            fileType: files[0].type
          });
        }
      } catch (error) {
        console.error('Failed to upload attachment:', error);
      }
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setMessage(prev => prev + emoji.native);
    if (messageRef.current) {
      messageRef.current.innerHTML += emoji.native;
    }
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = () => {
    if (messageRef.current) {
      setMessage(messageRef.current.innerText);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-1 min-h-[100px] max-h-[200px] overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-sm">
          <div
            ref={messageRef}
            contentEditable
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            className="p-3 focus:outline-none"
            placeholder="Type a message..."
          />
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,application/pdf"
          />

          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
          >
            <Smile className="h-5 w-5" />
          </button>

          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="p-2 text-white bg-indigo-600 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>

      {showEmojiPicker && (
        <div className="absolute bottom-20 right-4">
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
          />
        </div>
      )}
    </div>
  );
}