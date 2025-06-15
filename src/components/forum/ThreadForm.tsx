import React, { useState } from 'react';
import { FormInput } from '../forms/FormInput';
import { TextArea } from '../forms/TextArea';
import { Select } from '../forms/Select';
import { useUserIdeasWithRoles } from '../../hooks/ideas/useUserIdeasWithRoles';
import { useAuth } from '../../contexts/AuthContext';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

const CATEGORIES = [
  'General Discussion',
  'Ideas & Innovation',
  'Technical',
  'Business',
  'Marketing',
  'Legal',
  'Other'
];

export interface ThreadFormData {
  title: string;
  content: string;
  category: string;
  ideaId?: string;
  is_selling: boolean;
  is_seeking_funding: boolean;
  is_seeking_partners: boolean;
  is_looking_to_invest: boolean;
  is_looking_to_buy: boolean;
}

interface ThreadFormProps {
  onSubmit: (data: ThreadFormData) => Promise<void>;
  loading: boolean;
}

export function ThreadForm({ onSubmit, loading }: ThreadFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [ideaId, setIdeaId] = useState('');
  const [isSelling, setIsSelling] = useState(false);
  const [isSeekingFunding, setIsSeekingFunding] = useState(false);
  const [isSeekingPartners, setIsSeekingPartners] = useState(false);
  const [isLookingToInvest, setIsLookingToInvest] = useState(false);
  const [isLookingToBuy, setIsLookingToBuy] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentInput, setCurrentInput] = useState<'title' | 'content' | null>(null);

  const { user } = useAuth();
  const { ideasWithRoles } = useUserIdeasWithRoles(user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      content,
      category,
      ideaId: ideaId || undefined,
      is_selling: isSelling,
      is_seeking_funding: isSeekingFunding,
      is_seeking_partners: isSeekingPartners,
      is_looking_to_invest: isLookingToInvest,
      is_looking_to_buy: isLookingToBuy
    });
  };

  const addEmoji = (emoji: any) => {
    if (!currentInput) return;
    
    if (currentInput === 'title') {
      setTitle(prev => prev + emoji.native);
    } else if (currentInput === 'content') {
      setContent(prev => prev + emoji.native);
    }
    setShowEmojiPicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <FormInput
          id="title"
          label="Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setCurrentInput('title');
            setShowEmojiPicker(!showEmojiPicker);
          }}
          className="absolute right-2 top-8 text-gray-400 hover:text-gray-600"
        >
          😊
        </button>
      </div>

      <div className="relative">
        <TextArea
          id="content"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="button"
          onClick={() => {
            setCurrentInput('content');
            setShowEmojiPicker(!showEmojiPicker);
          }}
          className="absolute right-2 top-8 text-gray-400 hover:text-gray-600"
        >
          😊
        </button>
      </div>

      <Select
        id="category"
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={CATEGORIES}
      />

      {ideasWithRoles && ideasWithRoles.length > 0 && (
        <div>
          <label htmlFor="ideaId" className="block text-sm font-medium text-gray-700">
            Link to Project
          </label>
          <select
            id="ideaId"
            value={ideaId}
            onChange={(e) => setIdeaId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select a project</option>
            {ideasWithRoles.map(({ idea }) => (
              <option key={idea.id} value={idea.id}>
                {idea.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            id="isSelling"
            type="checkbox"
            checked={isSelling}
            onChange={(e) => setIsSelling(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isSelling" className="ml-2 block text-sm text-gray-900">
            I'm selling this project
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="isSeekingFunding"
            type="checkbox"
            checked={isSeekingFunding}
            onChange={(e) => setIsSeekingFunding(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isSeekingFunding" className="ml-2 block text-sm text-gray-900">
            I'm seeking funding
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="isSeekingPartners"
            type="checkbox"
            checked={isSeekingPartners}
            onChange={(e) => setIsSeekingPartners(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isSeekingPartners" className="ml-2 block text-sm text-gray-900">
            I'm seeking partners
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="isLookingToInvest"
            type="checkbox"
            checked={isLookingToInvest}
            onChange={(e) => setIsLookingToInvest(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isLookingToInvest" className="ml-2 block text-sm text-gray-900">
            I'm looking to invest
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="isLookingToBuy"
            type="checkbox"
            checked={isLookingToBuy}
            onChange={(e) => setIsLookingToBuy(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isLookingToBuy" className="ml-2 block text-sm text-gray-900">
            I'm looking to buy
          </label>
        </div>
      </div>

      {showEmojiPicker && (
        <div className="absolute z-10">
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !title || !content || !category}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Discussion'}
      </button>
    </form>
  );
}