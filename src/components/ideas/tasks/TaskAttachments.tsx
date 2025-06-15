import React, { useRef, useState } from 'react';
import { Paperclip, X, Download, Eye } from 'lucide-react';
import { useTaskAttachments } from '../../../hooks/ideas/useTaskAttachments';
import { Task } from '../../../types/database';

interface TaskAttachmentsProps {
  task: Task;
}

export function TaskAttachments({ task }: TaskAttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { attachments, uploadAttachment, deleteAttachment, loading, error } = useTaskAttachments(task.id);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      await uploadAttachment(files[0]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Attachments</h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
          disabled={uploading}
        >
          <Paperclip className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Add File'}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx"
      />

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto" />
          </div>
        ) : attachments.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No attachments yet</p>
        ) : (
          attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center min-w-0">
                <Paperclip className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <span className="ml-2 truncate text-sm text-gray-900">
                  {attachment.file_name}
                </span>
              </div>
              <div className="flex items-center ml-4 space-x-2">
                <a
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <Eye className="h-5 w-5" />
                </a>
                <a
                  href={attachment.file_url}
                  download
                  className="p-1 text-gray-400 hover:text-gray-500"
                >
                  <Download className="h-5 w-5" />
                </a>
                <button
                  onClick={() => deleteAttachment(attachment.id)}
                  className="p-1 text-red-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}