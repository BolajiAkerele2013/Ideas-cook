import React from 'react';
import { useParams } from 'react-router-dom';
import { ForumLayout } from '../../components/forum/ForumLayout';
import { ThreadContent } from '../../components/forum/ThreadContent';
import { CommentList } from '../../components/forum/CommentList';
import { CommentForm } from '../../components/forum/CommentForm';
import { useThread } from '../../hooks/forum/useThread';
import { useComments } from '../../hooks/forum/useComments';
import { useCreateComment } from '../../hooks/forum/useCreateComment';

export function ViewThread() {
  const { id } = useParams();
  const { thread, loading: threadLoading, error: threadError } = useThread(id);
  const { comments, loading: commentsLoading, error: commentsError, refresh } = useComments(id);
  const { createComment, loading: commentSubmitting } = useCreateComment();

  if (threadLoading || commentsLoading) {
    return (
      <ForumLayout>
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      </ForumLayout>
    );
  }

  if (threadError || !thread) {
    return (
      <ForumLayout>
        <div className="text-center py-8">
          <p className="text-red-600">Failed to load discussion</p>
        </div>
      </ForumLayout>
    );
  }

  const handleComment = async (content: string) => {
    await createComment(id!, content);
    refresh();
  };

  return (
    <ForumLayout>
      <div className="space-y-8">
        <ThreadContent thread={thread} />
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Comments</h2>
          </div>
          <CommentForm onSubmit={handleComment} loading={commentSubmitting} />
          {commentsError ? (
            <div className="p-6 text-center">
              <p className="text-red-600">Failed to load comments</p>
            </div>
          ) : (
            <CommentList comments={comments || []} />
          )}
        </div>
      </div>
    </ForumLayout>
  );
}