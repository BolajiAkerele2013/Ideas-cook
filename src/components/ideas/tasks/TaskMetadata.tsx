import React from 'react';
import { Calendar, Clock, Tag } from 'lucide-react';
import { Task } from '../../../types/database';
import { formatDate } from '../../../utils/date';
import { useIdeaMembers } from '../../../hooks/ideas/useIdeaMembers';

interface TaskMetadataProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
}

const TASK_CATEGORIES = [
  'Development',
  'Marketing',
  'Finance',
  'Design',
  'Research',
  'Other'
];

const TASK_STATUSES = ['Todo', 'In Progress', 'Review', 'Done'];

export function TaskMetadata({ task, onUpdate }: TaskMetadataProps) {
  const { members } = useIdeaMembers(task.idea_id);

  return (
    <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900">Details</h3>
        
        <dl className="mt-4 space-y-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Status</dt>
            <dd className="mt-1">
              <select
                value={task.status}
                onChange={(e) => onUpdate({ status: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {TASK_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Assigned To</dt>
            <dd className="mt-1">
              <select
                value={task.assigned_to || ''}
                onChange={(e) => onUpdate({ assigned_to: e.target.value || null })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Unassigned</option>
                {members?.map((member) => (
                  <option key={member.user_id} value={member.user_id}>
                    {member.profile.username}
                  </option>
                ))}
              </select>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Category</dt>
            <dd className="mt-1">
              <select
                value={task.category || ''}
                onChange={(e) => onUpdate({ category: e.target.value || null })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select category</option>
                {TASK_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Due Date</dt>
            <dd className="mt-1">
              <input
                type="date"
                value={task.due_date?.split('T')[0] || ''}
                onChange={(e) => onUpdate({ due_date: e.target.value })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-gray-500">Created</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {formatDate(task.created_at)}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}