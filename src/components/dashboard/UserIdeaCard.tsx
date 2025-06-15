import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Lock } from 'lucide-react';
import { Idea } from '../../types/database';
import { formatDate } from '../../utils/date';
import { formatRoleLabel } from '../../utils/format';

interface UserIdeaCardProps {
  idea: Idea;
  role: string;
  equityPercentage?: number;
}

export function UserIdeaCard({ idea, role, equityPercentage }: UserIdeaCardProps) {
  return (
    <Link
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
        
        <div className="mt-2 flex flex-wrap gap-2">
          {idea.problem_category && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {idea.problem_category}
            </span>
          )}
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            {formatRoleLabel(role)}
          </span>
          {equityPercentage && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {equityPercentage}% Equity
            </span>
          )}
        </div>

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
  );
}