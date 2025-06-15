import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Globe, Lock } from 'lucide-react';
import { Idea } from '../../types/database';
import { useAuth } from '../../contexts/AuthContext';

interface IdeaHeaderProps {
  idea: Idea;
}

export function IdeaHeader({ idea }: IdeaHeaderProps) {
  const { user } = useAuth();
  const isCreator = user?.id === idea.creator_id;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{idea.name}</h1>
          {idea.problem_category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
              {idea.problem_category}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {idea.visibility ? (
            <Globe className="h-5 w-5 text-gray-400" />
          ) : (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
          {isCreator && (
            <Link
              to={`/ideas/${idea.id}/edit`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}