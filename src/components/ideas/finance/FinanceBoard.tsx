import React from 'react';
import { useFinances } from '../../../hooks/ideas/useFinances';
import { FundingProgress } from './FundingProgress';
import { TransactionList } from './TransactionList';
import { InvoiceManager } from './InvoiceManager';

interface FinanceBoardProps {
  ideaId: string;
}

export function FinanceBoard({ ideaId }: FinanceBoardProps) {
  const { finances, loading, error } = useFinances(ideaId);

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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <FundingProgress finances={finances} />
        <TransactionList transactions={finances.transactions} />
      </div>
      <InvoiceManager ideaId={ideaId} />
    </div>
  );
}