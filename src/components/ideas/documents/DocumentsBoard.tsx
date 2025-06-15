import React, { useState } from 'react';
import { useDocuments } from '../../../hooks/ideas/useDocuments';
import { DocumentUpload } from './DocumentUpload';
import { DocumentList } from './DocumentList';
import { DocumentSearch } from './DocumentSearch';
import { TemplatesBoard } from './templates/TemplatesBoard';
import { useAuth } from '../../../contexts/AuthContext';
import { useIdeaPermissions } from '../../../hooks/ideas/useIdeaPermissions';

interface DocumentsBoardProps {
  ideaId: string;
}

type Tab = 'documents' | 'templates';

export function DocumentsBoard({ ideaId }: DocumentsBoardProps) {
  const { documents, loading, error, deleteDocument } = useDocuments(ideaId);
  const { user } = useAuth();
  const { canWrite } = useIdeaPermissions(ideaId);
  const [activeTab, setActiveTab] = useState<Tab>('documents');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <p className="text-red-600">Failed to load documents</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('documents')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'documents'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            My Documents
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
              ${activeTab === 'templates'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Business Templates
          </button>
        </nav>
      </div>

      {activeTab === 'documents' ? (
        <>
          {canWrite && <DocumentUpload ideaId={ideaId} />}
          
          <DocumentSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <DocumentList
            documents={filteredDocuments || []}
            canDelete={canWrite}
            onDelete={deleteDocument}
          />
        </>
      ) : (
        <TemplatesBoard />
      )}
    </div>
  );
}