import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Users, TrendingUp, Eye, Lightbulb, User, Clock } from 'lucide-react';
import { formatDate } from '../../utils/date';

interface ThreadContentProps {
  thread: {
    title: string;
    content: string;
    category: string;
    creator: {
      username: string;
      avatar_url?: string;
    };
    is_selling: boolean;
    is_seeking_funding: boolean;
    is_seeking_partners: boolean;
    view_count: number;
    created_at: string;
    idea?: {
      id: string;
      name: string;
      problem_category?: string;
    };
  };
}

export function ThreadContent({ thread }: ThreadContentProps) {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          {thread.creator.avatar_url ? (
            <img
              src={thread.creator.avatar_url}
              alt={thread.creator.username}
              className="w-16 h-16 rounded-full border-2 border-white shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{thread.title}</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="font-semibold">{thread.creator.username}</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDate(thread.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4" />
              <span>{thread.view_count} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border">
          {thread.category}
        </span>
        {thread.is_selling && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
            <DollarSign className="h-4 w-4 mr-1" />
            For Sale
          </span>
        )}
        {thread.is_seeking_funding && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
            <TrendingUp className="h-4 w-4 mr-1" />
            Seeking Funding
          </span>
        )}
        {thread.is_seeking_partners && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
            <Users className="h-4 w-4 mr-1" />
            Seeking Partners
          </span>
        )}
      </div>

      {/* Linked Project */}
      {thread.idea && (
        <div className="mb-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
          <Link 
            to={`/ideas/${thread.idea.id}`}
            className="flex items-start space-x-4 hover:bg-indigo-100 p-3 rounded-xl transition-colors group"
          >
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-900 group-hover:text-indigo-700">
                Linked Project: {thread.idea.name}
              </h3>
              {thread.idea.problem_category && (
                <p className="text-indigo-700 mt-1">
                  Category: {thread.idea.problem_category}
                </p>
              )}
              <p className="text-sm text-indigo-600 mt-2">Click to view project details →</p>
            </div>
          </Link>
        </div>
      )}

      {/* Content */}
      <div className="prose max-w-none">
        <div className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
          {thread.content}
        </div>
      </div>
    </div>
  );
}