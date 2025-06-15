import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Users, TrendingUp, Eye, Lightbulb } from 'lucide-react';
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
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
        
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {thread.category}
          </span>
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

        {thread.idea && (
          <div className="mt-4 bg-indigo-50 rounded-lg p-4">
            <Link 
              to={`/ideas/${thread.idea.id}`}
              className="flex items-start space-x-3 hover:bg-indigo-100 p-2 rounded-md transition-colors"
            >
              <Lightbulb className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-indigo-900">
                  Linked Project: {thread.idea.name}
                </h3>
                {thread.idea.problem_category && (
                  <p className="text-sm text-indigo-700 mt-0.5">
                    {thread.idea.problem_category}
                  </p>
                )}
              </div>
            </Link>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500 flex items-center space-x-4">
          <span>{thread.creator.username}</span>
          <span>•</span>
          <span>{formatDate(thread.created_at)}</span>
          <span>•</span>
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            {thread.view_count} views
          </span>
        </div>

        <div className="mt-6 prose max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap">{thread.content}</p>
        </div>
      </div>
    </div>
  );
}