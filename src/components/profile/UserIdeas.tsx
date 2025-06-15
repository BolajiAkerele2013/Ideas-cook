import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Lock, Globe } from 'lucide-react';
import { useUserIdeas } from '../../hooks/ideas/useUserIdeas';
import { formatDate } from '../../utils/date';

interface UserIdeasProps {
  userId?: string;
}

export function UserIdeas({ userId }: UserIdeasProps) {
  const { ideas, loading, error } = useUserIdeas(userId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load ideas</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Ideas</h2>
        <Link
          to="/ideas/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          New Idea
        </Link>
      </div>

      {ideas?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <PlusCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No ideas yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new idea.</p>
          <div className="mt-6">
            <Link
              to="/ideas/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              New Idea
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {ideas?.map((idea) => (
            <Link
              key={idea.id}
              to={`/ideas/${idea.id}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">{idea.name}</h3>
                  {idea.visibility ? (
                    <Globe className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Lock className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                {idea.problem_category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                    {idea.problem_category}
                  </span>
                )}
                {idea.description && (
                  <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    {idea.description}
                  </p>
                )}
                <div className="mt-4 text-xs text-gray-500">
                  Created {formatDate(idea.created_at)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}