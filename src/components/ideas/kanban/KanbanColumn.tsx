import React from 'react';
import { Task } from '../../../types/database';
import { KanbanTask } from './KanbanTask';

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: string) => void;
}

export function KanbanColumn({ title, tasks, onTaskMove }: KanbanColumnProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-medium text-gray-900 mb-4">{title}</h4>
      <div className="space-y-3">
        {tasks.map(task => (
          <KanbanTask
            key={task.id}
            task={task}
            onStatusChange={(newStatus) => onTaskMove(task.id, newStatus)}
          />
        ))}
      </div>
    </div>
  );
}