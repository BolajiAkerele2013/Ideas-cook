import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useUserIdeasWithRoles } from '../../hooks/ideas/useUserIdeasWithRoles';
import { UserIdeaCard } from './UserIdeaCard';

interface UserIdeasGridProps {
  userId?: string;
}

export function UserIdeasGrid({ userId }: UserIdeasGridProps) {
  const { ideasWithRoles, loading, error } = useUserIdeasWithRoles(userId);

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

      {ideasWithRoles.length === 0 ? (
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
          {ideasWithRoles.map(({ idea, role, equityPercentage }) => (
            <UserIdeaCard
              key={idea.id}
              idea={idea}
              role={role}
              equityPercentage={equityPercentage}
            />
          ))}
        </div>
      )}
    </div>
  );
}