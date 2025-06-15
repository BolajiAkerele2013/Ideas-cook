import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, DollarSign, Users, TrendingUp, Eye, Lightbulb } from 'lucide-react';
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
    <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
      {threads.map((thread) => (
        <div key={thread.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link
                to={`/forum/thread/${thread.id}`}
                className="text-lg font-medium text-indigo-600 hover:text-indigo-900"
              >
                {thread.title}
              </Link>
              <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                <span>{thread.creator.username}</span>
                <span>•</span>
                <span>{formatDate(thread.created_at)}</span>
                <span>•</span>
                <span className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {thread.comment_count}
                </span>
                <span>•</span>
                <span>{thread.view_count} views</span>
              </div>
              {thread.idea && (
                <div className="mt-2">
                  <Link
                    to={`/ideas/${thread.idea.id}`}
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                  >
                    <Lightbulb className="h-4 w-4 mr-1" />
                    {thread.idea.name}
                  </Link>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 ml-4">
              {thread.is_selling && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <DollarSign className="h-3 w-3 mr-1" />
                  For Sale
                </span>
              )}
              {thread.is_seeking_funding && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Seeking Funding
                </span>
              )}
              {thread.is_seeking_partners && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  <Users className="h-3 w-3 mr-1" />
                  Seeking Partners
                </span>
              )}
            </div>
          </div>
          <div className="mt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {thread.category}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}