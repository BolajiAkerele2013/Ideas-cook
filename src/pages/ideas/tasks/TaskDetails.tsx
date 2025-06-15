import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Paperclip, MessageSquare, History } from 'lucide-react';
import { useTask } from '../../../hooks/ideas/useTask';
import { TaskHeader } from '../../../components/ideas/tasks/TaskHeader';
import { TaskDescription } from '../../../components/ideas/tasks/TaskDescription';
import { TaskAttachments } from '../../../components/ideas/tasks/TaskAttachments';
import { TaskComments } from '../../../components/ideas/tasks/TaskComments';
import { TaskActivity } from '../../../components/ideas/tasks/TaskActivity';
import { TaskMetadata } from '../../../components/ideas/tasks/TaskMetadata';

export function TaskDetails() {
  const { ideaId, taskId } = useParams();
  const navigate = useNavigate();
  const { task, loading, error, updateTask } = useTask(taskId!);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load task</p>
      </div>
    );
  }

  const handleClose = () => {
    navigate(`/ideas/${ideaId}`);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 overflow-hidden flex flex-col">
      <TaskHeader task={task} onClose={handleClose} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <TaskDescription task={task} onUpdate={updateTask} />
              <TaskAttachments task={task} />
              <TaskComments taskId={task.id} />
            </div>
            
            <div className="space-y-6">
              <TaskMetadata task={task} onUpdate={updateTask} />
              <TaskActivity taskId={task.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}