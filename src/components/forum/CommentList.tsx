import React from 'react';
import { formatDate } from '../../utils/date';

interface Comment {
  id: string;
  content: string;
  creator: {
    username: string;
    avatar_url?: string;
  };
  created_at: string;
}

interface CommentListProps {
  comments: Comment[];
}

export function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {comments.map((comment) => (
        <div key={comment.id} className="p-6">
          <div className="flex space-x-3">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  {comment.creator.username}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(comment.created_at)}
                </p>
              </div>
              <div className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}