import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Plus, TrendingUp, Sparkles } from 'lucide-react';

export function ForumLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
            <div className="relative w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mr-4">
              <MessageSquare className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center">
              Community Forum
              <Sparkles className="h-6 w-6 text-blue-600 ml-2" />
            </h1>
            <p className="text-gray-600 text-lg">Share ideas and connect with innovators worldwide</p>
          </div>
        </div>
        <Link
          to="/forum/new"
          className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-1 shadow-xl hover:shadow-2xl"
        >
          <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
          Start Discussion
        </Link>
      </div>
      {children}
    </div>
  );
}