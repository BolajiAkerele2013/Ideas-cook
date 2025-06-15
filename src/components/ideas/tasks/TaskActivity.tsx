import React from 'react';
import { useTaskActivity } from '../../../hooks/ideas/useTaskActivity';
import { formatDate } from '../../../utils/date';
import { UserCircle, Clock } from 'lucide-react';

interface TaskActivityProps {
  taskId: string;
}

export function TaskActivity({ taskId }: TaskActivityProps) {
  const { activities, loading, error } = useTaskActivity(taskId);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Activity</h3>
      </div>

      {error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : loading ? (
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto" />
        </div>
      ) : (
        <div className="p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, index) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {index !== activities.length - 1 && (
                      <span
                        className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex space-x-3">
                      <div>
                        {activity.user.avatar_url ? (
                          <img
                            src={activity.user.avatar_url}
                            alt={activity.user.username}
                            className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                          />
                        ) : (
                          <UserCircle className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                        <div>
                          <p className="text-sm text-gray-500">
                            {activity.description}{' '}
                            <span className="font-medium text-gray-900">
                              {activity.user.username}
                            </span>
                          </p>
                        </div>
                        <div className="text-right text-sm whitespace-nowrap text-gray-500">
                          <Clock className="inline-block h-4 w-4 mr-1" />
                          {formatDate(activity.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}