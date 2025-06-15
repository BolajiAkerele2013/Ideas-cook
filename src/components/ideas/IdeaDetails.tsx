import React from 'react';
import { Idea } from '../../types/database';
import { formatDate } from '../../utils/date';

interface IdeaDetailsProps {
  idea: Idea;
}

export function IdeaDetails({ idea }: IdeaDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Idea Details</h3>
      </div>
      <div className="px-6 py-5 space-y-6">
        {idea.description && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Description</h4>
            <p className="mt-2 text-gray-600">{idea.description}</p>
          </div>
        )}
        {idea.solution && (
          <div>
            <h4 className="text-sm font-medium text-gray-700">Solution</h4>
            <p className="mt-2 text-gray-600">{idea.solution}</p>
          </div>
        )}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Created {formatDate(idea.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}