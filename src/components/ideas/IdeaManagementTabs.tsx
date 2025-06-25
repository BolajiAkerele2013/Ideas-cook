import React, { useState } from 'react';
import { Users, DollarSign, FileText, BarChart3, Kanban, Shield as FileShield, Plus } from 'lucide-react';
import { IdeaMembers } from './IdeaMembers';
import { FinanceBoard } from './finance/FinanceBoard';
import { DocumentsBoard } from './documents/DocumentsBoard';
import { MetricsDashboard } from './metrics/MetricsDashboard';
import { KanbanBoard } from './kanban/KanbanBoard';
import { NDATab } from './NDATab';
import { DebtFinancierForm } from './DebtFinancierForm';
import { useIdeaPermissions } from '../../hooks/ideas/useIdeaPermissions';

interface IdeaManagementTabsProps {
  idea: any;
  onUpdate: () => void;
}

export function IdeaManagementTabs({ idea, onUpdate }: IdeaManagementTabsProps) {
  const [activeTab, setActiveTab] = useState('tasks');
  const [showDebtForm, setShowDebtForm] = useState(false);
  const { canManageFinances, canEditIdea } = useIdeaPermissions(idea.id);

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: Kanban },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'metrics', label: 'Metrics', icon: BarChart3 },
    { id: 'nda', label: 'NDA', icon: FileShield }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <KanbanBoard ideaId={idea.id} />;
      case 'team':
        return (
          <div className="space-y-6">
            {canEditIdea && (
              <div className="flex justify-end">
                <button
                  onClick={() => setShowDebtForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Debt Financier</span>
                </button>
              </div>
            )}
            <IdeaMembers ideaId={idea.id} onUpdate={onUpdate} />
          </div>
        );
      case 'finance':
        return <FinanceBoard ideaId={idea.id} />;
      case 'documents':
        return <DocumentsBoard ideaId={idea.id} />;
      case 'metrics':
        return <MetricsDashboard ideaId={idea.id} />;
      case 'nda':
        return <NDATab ideaId={idea.id} canEdit={canEditIdea} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>

      {/* Debt Financier Form Modal */}
      {showDebtForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <DebtFinancierForm
              ideaId={idea.id}
              onSuccess={() => {
                setShowDebtForm(false);
                onUpdate();
              }}
              onCancel={() => setShowDebtForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}