import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { TaskForm } from './TaskForm';
import { useKanbanTasks } from '../../../hooks/ideas/useKanbanTasks';

interface KanbanBoardProps {
  ideaId: string;
}

const COLUMNS = ['Todo', 'In Progress', 'Review', 'Done'];

export function KanbanBoard({ ideaId }: KanbanBoardProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const { tasks, loading, error, addTask, updateTask } = useKanbanTasks(ideaId);

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
        <p className="text-red-600">Failed to load tasks</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Tasks</h3>
        <button
          onClick={() => setShowTaskForm(true)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded text-indigo-600 hover:text-indigo-900"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Task
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4">
          {COLUMNS.map(status => (
            <KanbanColumn
              key={status}
              title={status}
              tasks={tasks.filter(task => task.status === status)}
              onTaskMove={updateTask}
            />
          ))}
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          onSubmit={async (data) => {
            await addTask(data);
            setShowTaskForm(false);
          }}
          onClose={() => setShowTaskForm(false)}
        />
      )}
    </div>
  );
}