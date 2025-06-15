import React from 'react';
import { X } from 'lucide-react';
import { Task } from '../../../types/database';

interface TaskHeaderProps {
  task: Task;
  onClose: () => void;
}

export function TaskHeader({ task, onClose }: TaskHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
        <button
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}