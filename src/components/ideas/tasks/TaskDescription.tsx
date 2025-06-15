import React, { useState } from 'react';
import { Task } from '../../../types/database';

interface TaskDescriptionProps {
  task: Task;
  onUpdate: (updates: Partial<Task>) => Promise<void>;
}

export function TaskDescription({ task, onUpdate }: TaskDescriptionProps) {
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(task.description || '');

  const handleSave = async () => {
    await onUpdate({ description });
    setEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Description</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Add a detailed description..."
          />
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {task.description || (
            <p className="text-gray-500 italic">No description provided</p>
          )}
        </div>
      )}
    </div>
  );
}