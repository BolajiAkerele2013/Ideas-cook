import React from 'react';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface FundingProgressProps {
  finances: {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
  };
}

export function FundingProgress({ finances }: FundingProgressProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Overview</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="flex items-center text-green-600">
            <ArrowUpCircle className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Income</span>
          </div>
          <p className="mt-1 text-2xl font-semibold">${finances.totalIncome.toLocaleString()}</p>
        </div>
        <div>
          <div className="flex items-center text-red-600">
            <ArrowDownCircle className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Expenses</span>
          </div>
          <p className="mt-1 text-2xl font-semibold">${finances.totalExpenses.toLocaleString()}</p>
        </div>
        <div>
          <div className="flex items-center text-gray-600">
            <span className="text-sm font-medium">Balance</span>
          </div>
          <p className="mt-1 text-2xl font-semibold">${finances.balance.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}