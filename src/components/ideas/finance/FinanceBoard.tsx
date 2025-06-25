import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useFinances } from '../../../hooks/ideas/useFinances';
import { useIdeaPermissions } from '../../../hooks/ideas/useIdeaPermissions';
import { FundingProgress } from './FundingProgress';
import { TransactionList } from './TransactionList';
import { InvoiceManager } from './InvoiceManager';
import { EnhancedTransactionForm } from '../EnhancedTransactionForm';

interface FinanceBoardProps {
  ideaId: string;
}

export function FinanceBoard({ ideaId }: FinanceBoardProps) {
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const { finances, loading, error, refresh } = useFinances(ideaId);
  const { canManageFinances } = useIdeaPermissions(ideaId);

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
        <p className="text-red-600">Failed to load financial data</p>
      </div>
    );
  }

  const handleTransactionSuccess = () => {
    setShowTransactionForm(false);
    refresh();
  };

  return (
    <div className="space-y-6">
      {canManageFinances && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowTransactionForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </button>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <FundingProgress finances={finances} />
        <TransactionList transactions={finances.transactions} />
      </div>
      <InvoiceManager ideaId={ideaId} />

      {/* Transaction Form Modal */}
      {showTransactionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EnhancedTransactionForm
              ideaId={ideaId}
              onSuccess={handleTransactionSuccess}
              onCancel={() => setShowTransactionForm(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}