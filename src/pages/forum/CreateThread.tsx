import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ForumLayout } from '../../components/forum/ForumLayout';
import { ThreadForm, ThreadFormData } from '../../components/forum/ThreadForm';
import { useCreateThread } from '../../hooks/forum/useCreateThread';

export function CreateThread() {
  const navigate = useNavigate();
  const { createThread, loading, error } = useCreateThread();

  const handleSubmit = async (data: ThreadFormData) => {
    const success = await createThread(data);
    if (success) {
      navigate('/forum');
    }
  };

  return (
    <ForumLayout>
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Discussion</h2>
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        <ThreadForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </ForumLayout>
  );
}