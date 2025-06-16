import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, DollarSign, Users, TrendingUp, Eye, Lightbulb, Clock, User } from 'lucide-react';
import { formatDate } from '../../utils/date';

interface Thread {
  id: string;
  title: string;
  category: string;
  creator: {
    username: string;
    avatar_url?: string;
  };
  is_selling: boolean;
  is_seeking_funding: boolean;
  is_seeking_partners: boolean;
  view_count: number;
  comment_count: number;
  created_at: string;
  idea?: {
    id: string;
    name: string;
    problem_category?: string;
  };
}

interface ThreadListProps {
  threads: Thread[];
}

export function ThreadList({ threads }: ThreadListProps) {
  return (
    <div className="divide-y divide-gray-100">
      {threads.map((thread, index) => (
        <div key={thread.id} className="group p-8 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                  {thread.creator.avatar_url ? (
                    <img
                      src={thread.creator.avatar_url}
                      alt={thread.creator.username}
                      className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{thread.creator.username}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-2">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(thread.created_at)}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/forum/thread/${thread.id}`}
                className="block group-hover:text-blue-600 transition-colors"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {thread.title}
                </h3>
              </Link>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                  {thread.category}
                </span>
                {thread.is_selling && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200">
                    <DollarSign className="h-3 w-3 mr-1" />
                    For Sale
                  </span>
                )}
                {thread.is_seeking_funding && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Seeking Funding
                  </span>
                )}
                {thread.is_seeking_partners && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                    <Users className="h-3 w-3 mr-1" />
                    Seeking Partners
                  </span>
                )}
              </div>

              {thread.idea && (
                <div className="mb-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                  <Link
                    to={`/ideas/${thread.idea.id}`}
                    className="flex items-start space-x-3 hover:bg-indigo-100 p-2 rounded-lg transition-colors group"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-indigo-900 group-hover:text-indigo-700">
                        Linked Project: {thread.idea.name}
                      </h4>
                      {thread.idea.problem_category && (
                        <p className="text-sm text-indigo-700 mt-0.5">
                          {thread.idea.problem_category}
                        </p>
                      )}
                    </div>
                  </Link>
                </div>
              )}

              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">{thread.comment_count}</span>
                  <span>replies</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{thread.view_count}</span>
                  <span>views</span>
                </div>
              </div>
            </div>

            <div className="ml-6 flex-shrink-0">
              <div className="flex flex-col items-end space-y-2">
                {(thread.is_selling || thread.is_seeking_funding || thread.is_seeking_partners) && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                )}
                <Link
                  to={`/forum/thread/${thread.id}`}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                >
                  View Discussion
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}