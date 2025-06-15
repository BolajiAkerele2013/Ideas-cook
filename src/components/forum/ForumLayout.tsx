import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus, TrendingUp } from 'lucide-react';

export function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
            <p className="text-gray-600">Share ideas and connect with innovators</p>
          </div>
        </div>
        <Link
          to="/forum/new"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Discussion
        </Link>
      </div>
      {children}
    </div>
  );
}