import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFlowcharts } from '../../../hooks/ideas/useFlowcharts';
import { FlowchartList } from './FlowchartList';
import { FlowchartEditor } from './FlowchartEditor';
import { FlowchartSearch } from './FlowchartSearch';
import { useAuth } from '../../../contexts/AuthContext';
import { useIdeaPermissions } from '../../../hooks/ideas/useIdeaPermissions';

interface FlowchartBoardProps {
  ideaId: string;
}

export function FlowchartBoard({ ideaId }: FlowchartBoardProps) {
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { flowcharts, loading, error, refresh } = useFlowcharts(ideaId);
  const { user } = useAuth();
  const { canWrite } = useIdeaPermissions(ideaId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredFlowcharts = flowcharts?.filter(chart => {
    const matchesSearch = chart.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || chart.category === selectedCategory;
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
        <p className="text-red-600">Failed to load flowcharts</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showEditor || editingId ? (
        <FlowchartEditor
          ideaId={ideaId}
          flowchartId={editingId}
          onClose={() => {
            setShowEditor(false);
            setEditingId(null);
            refresh();
          }}
        />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Flowcharts</h2>
            {canWrite && (
              <button
                onClick={() => setShowEditor(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Flowchart
              </button>
            )}
          </div>

          <FlowchartSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <FlowchartList
            flowcharts={filteredFlowcharts || []}
            canEdit={canWrite}
            onEdit={setEditingId}
          />
        </>
      )}
    </div>
  );
}