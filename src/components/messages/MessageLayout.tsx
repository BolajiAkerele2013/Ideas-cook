import React from 'react';
import { MessageSidebar } from './MessageSidebar';
import { MessageHeader } from './MessageHeader';

interface MessageLayoutProps {
  children: React.ReactNode;
}

export function MessageLayout({ children }: MessageLayoutProps) {
  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <MessageSidebar />
      <div className="flex-1 flex flex-col">
        <MessageHeader />
        {children}
      </div>
    </div>
  );
}