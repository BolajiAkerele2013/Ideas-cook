import React from 'react';
import { Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Task } from '../../../types/database';
import { formatDate } from '../../../utils/date';

interface KanbanTaskProps {
  task: Task;
  onStatusChange: (newStatus: string) => void;
}

export function KanbanTask({ task, onStatusChange }: KanbanTaskProps) {
  const navigate = useNavigate();
  const statuses = ['Todo', 'In Progress', 'Review', 'Done'];

  const handleClick = () => {
    navigate(`/ideas/${task.idea_id}/tasks/${task.id}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    onStatusChange(e.target.value);
  };

  return (
    <div
      className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleClick}
    >
      <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
      
      {task.description && (
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {task.assigned_to && (
            <div className="flex items-center text-gray-500">
              <User className="h-4 w-4 mr-1" />
              <span className="text-xs">Assigned</span>
            </div>
          )}
          
          {task.due_date && (
            <div className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-xs">{formatDate(task.due_date)}</span>
            </div>
          )}
        </div>

        <select
          value={task.status}
          onChange={handleStatusChange}
          onClick={(e) => e.stopPropagation()}
          className="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}