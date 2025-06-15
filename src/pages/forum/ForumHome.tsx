import React from 'react';
import { ForumLayout } from '../../components/forum/ForumLayout';
import { ThreadList } from '../../components/forum/ThreadList';
import { useThreads } from '../../hooks/forum/useThreads';

export function ForumHome() {
  const { threads, loading, error } = useThreads();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <ForumLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        </ForumLayout>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <ForumLayout>
          <div className="text-center py-16">
            <p className="text-red-600 text-lg">Failed to load discussions</p>
          </div>
        </ForumLayout>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <ForumLayout>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Community Discussions</h2>
              <p className="text-blue-100 text-lg">
                Connect with innovators, share ideas, and find collaboration opportunities
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
              alt="Community discussion"
              className="hidden md:block w-32 h-32 rounded-xl object-cover opacity-80"
            />
          </div>
        </div>

        <ThreadList threads={threads || []} />
      </ForumLayout>
    </div>
  );
}