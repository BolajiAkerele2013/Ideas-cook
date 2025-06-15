import React from 'react';
import { FileText, Image, Video } from 'lucide-react';

interface MessageAttachmentsProps {
  attachments: {
    id: string;
    file_url: string;
    file_type: string;
    file_name: string;
  }[];
}

export function MessageAttachments({ attachments }: MessageAttachmentsProps) {
  const renderAttachment = (attachment: any) => {
    if (attachment.file_type.startsWith('image/')) {
      return (
        <div className="relative group">
          <img
            src={attachment.file_url}
            alt={attachment.file_name}
            className="max-w-sm rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 rounded-lg">
            <a
              href={attachment.file_url}
              download
              className="p-2 bg-white rounded-full"
            >
              <Image className="h-5 w-5 text-gray-600" />
            </a>
          </div>
        </div>
      );
    }

    if (attachment.file_type.startsWith('video/')) {
      return (
        <div className="max-w-sm">
          <video
            controls
            className="rounded-lg"
          >
            <source src={attachment.file_url} type={attachment.file_type} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    return (
      <a
        href={attachment.file_url}
        download
        className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
      >
        <FileText className="h-5 w-5 text-gray-400 mr-2" />
        <span className="text-sm text-gray-700">{attachment.file_name}</span>
      </a>
    );
  };

  return (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment) => (
        <div key={attachment.id}>
          {renderAttachment(attachment)}
        </div>
      ))}
    </div>
  );
}