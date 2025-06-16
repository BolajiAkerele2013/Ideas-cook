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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <ForumLayout>
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        </ForumLayout>
      </div>
    );
  }

  if (threadError || !thread) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <ForumLayout>
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load discussion</p>
          </div>
        </ForumLayout>
      </div>
    );
  }

  const handleComment = async (content: string) => {
    await createComment(id!, content);
    refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <ForumLayout>
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
            <ThreadContent thread={thread} />
          </div>
          
          <div className="bg-white shadow-xl rounded-3xl overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                Discussion
                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {comments?.length || 0} replies
                </span>
              </h2>
            </div>
            <CommentForm onSubmit={handleComment} loading={commentSubmitting} />
            {commentsError ? (
              <div className="p-8 text-center">
                <p className="text-red-600">Failed to load comments</p>
              </div>
            ) : (
              <CommentList comments={comments || []} />
            )}
          </div>
        </div>
      </ForumLayout>
    </div>
  );
}