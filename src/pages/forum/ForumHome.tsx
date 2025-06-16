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
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 mb-12 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Community Discussions
              </h2>
              <p className="text-xl text-blue-100 mb-6 leading-relaxed">
                Connect with innovators, share ideas, and find collaboration opportunities in our vibrant community
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Active Community</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Expert Insights</span>
                </div>
                <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                  <span className="text-sm font-medium">Collaboration</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl transform rotate-3 opacity-30"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                alt="Community discussion"
                className="relative rounded-2xl shadow-2xl w-full h-80 object-cover"
              />
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-20 right-20 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">{threads?.length || 0}</p>
                <p className="text-gray-600 text-sm font-medium">Active Discussions</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💬</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">1.2k</p>
                <p className="text-gray-600 text-sm font-medium">Community Members</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">👥</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">89</p>
                <p className="text-gray-600 text-sm font-medium">Ideas Shared</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">💡</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-gray-900">45</p>
                <p className="text-gray-600 text-sm font-medium">Collaborations</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🤝</span>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Categories</h3>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Ideas & Innovation', icon: '💡', color: 'from-blue-500 to-blue-600' },
              { name: 'Technical', icon: '⚙️', color: 'from-indigo-500 to-indigo-600' },
              { name: 'Business', icon: '💼', color: 'from-purple-500 to-purple-600' },
              { name: 'Marketing', icon: '📈', color: 'from-green-500 to-green-600' },
              { name: 'Legal', icon: '⚖️', color: 'from-yellow-500 to-yellow-600' },
              { name: 'Other', icon: '🌟', color: 'from-pink-500 to-pink-600' },
            ].map((category) => (
              <div
                key={category.name}
                className="group bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <h4 className="font-semibold text-gray-900 text-sm">{category.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Discussions List */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Latest Discussions</h3>
                <p className="text-gray-600 mt-1">Join the conversation and share your thoughts</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 font-medium">Live updates</span>
              </div>
            </div>
          </div>
          
          {threads && threads.length > 0 ? (
            <ThreadList threads={threads} />
          ) : (
            <div className="p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No discussions yet</h3>
              <p className="text-gray-600 mb-6">Be the first to start a conversation in our community!</p>
            </div>
          )}
        </div>
      </ForumLayout>
    </div>
  );
}