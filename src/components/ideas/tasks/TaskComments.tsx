import React, { useState } from 'react';
import { useTaskComments } from '../../../hooks/ideas/useTaskComments';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDate } from '../../../utils/date';
import { UserCircle } from 'lucide-react';

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const [content, setContent] = useState('');
  const { comments, addComment, loading, error } = useTaskComments(taskId);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    await addComment(content);
    setContent('');
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Comments</h2>
      </div>

      {error && (
        <div className="p-4 bg-red-100 border-b border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="divide-y divide-gray-200">
        {comments.map((comment) => (
          <div key={comment.id} className="p-6">
            <div className="flex space-x-3">
              {comment.creator.avatar_url ? (
                <img
                  src={comment.creator.avatar_url}
                  alt={comment.creator.username}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <UserCircle className="h-8 w-8 text-gray-400" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {comment.creator.username}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(comment.created_at)}
                  </p>
                </div>
                <div className="mt-1 text-sm text-gray-700 whitespace-pre-wrap">
                  {comment.content}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {user && (
        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-200">
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
      )}
    </div>
  );
}