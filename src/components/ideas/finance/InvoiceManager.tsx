import React from 'react';
import { FileText, CheckCircle, Clock } from 'lucide-react';
import { useInvoices } from '../../../hooks/ideas/useInvoices';

interface InvoiceManagerProps {
  ideaId: string;
}

export function InvoiceManager({ ideaId }: InvoiceManagerProps) {
  const { invoices, loading, error } = useInvoices(ideaId);

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
        <p className="text-red-600">Failed to load invoices</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {invoices.map(invoice => (
          <div key={invoice.id} className="px-6 py-4">
            <div className="flex justify-between items-start">
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Invoice #{invoice.number}</p>
                  <p className="text-sm text-gray-500">{invoice.client}</p>
                </div>
              </div>
              <div className="ml-6 text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${invoice.amount.toLocaleString()}
                </p>
                <div className="mt-1 flex items-center justify-end">
                  {invoice.status === 'paid' ? (
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  )}
                  <span className="text-xs capitalize text-gray-500">{invoice.status}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}