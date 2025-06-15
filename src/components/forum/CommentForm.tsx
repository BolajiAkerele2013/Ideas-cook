import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>;
  loading: boolean;
}

export function CommentForm({ onSubmit, loading }: CommentFormProps) {
  const [content, setContent] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      await onSubmit(content);
      setContent('');
    }
  };

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Please sign in to comment.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 border-b border-gray-200">
      <div>
        <label htmlFor="comment" className="sr-only">
          Add your comment
        </label>
        <textarea
          id="comment"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add your comment..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}