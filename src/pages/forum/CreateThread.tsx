import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, MessageSquare } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <ForumLayout>
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-30 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
              </div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start a New Discussion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Share your ideas, ask questions, or start a conversation with our vibrant community
            </p>
            
            {/* Decorative elements */}
            <div className="flex justify-center mt-8 space-x-8">
              <div className="flex items-center text-blue-600">
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Share Ideas</span>
              </div>
              <div className="flex items-center text-indigo-600">
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Get Feedback</span>
              </div>
              <div className="flex items-center text-blue-600">
                <Sparkles className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Find Partners</span>
              </div>
            </div>
          </div>

          {/* Background Image */}
          <div className="relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl"></div>
            <img
              src="https://images.unsplash.com/photo-1515378791036-0648a814c963?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80"
              alt="Community discussion"
              className="w-full h-64 object-cover rounded-2xl shadow-xl"
            />
          </div>

          {/* Form Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                {error}
              </div>
            )}
            <ThreadForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>
      </ForumLayout>
    </div>
  );
}