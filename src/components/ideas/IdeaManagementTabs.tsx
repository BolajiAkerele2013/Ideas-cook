import React, { useState } from 'react';
import { KanbanBoard } from './kanban/KanbanBoard';
import { FinanceBoard } from './finance/FinanceBoard';
import { MetricsDashboard } from './metrics/MetricsDashboard';
import { DocumentsBoard } from './documents/DocumentsBoard';
import { FlowchartBoard } from './flowcharts/FlowchartBoard';

interface IdeaManagementTabsProps {
  ideaId: string;
}

const TABS = [
  { id: 'tasks', label: 'Tasks' },
  { id: 'finances', label: 'Finances' },
  { id: 'documents', label: 'Documents' },
  { id: 'flowcharts', label: 'Flowcharts' },
  { id: 'metrics', label: 'Metrics' }
] as const;

export function IdeaManagementTabs({ ideaId }: IdeaManagementTabsProps) {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('tasks');

  return (
    <div className="mt-8">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-6">
        {activeTab === 'tasks' && <KanbanBoard ideaId={ideaId} />}
        {activeTab === 'finances' && <FinanceBoard ideaId={ideaId} />}
        {activeTab === 'documents' && <DocumentsBoard ideaId={ideaId} />}
        {activeTab === 'flowcharts' && <FlowchartBoard ideaId={ideaId} />}
        {activeTab === 'metrics' && <MetricsDashboard ideaId={ideaId} />}
      </div>
    </div>
  );
}