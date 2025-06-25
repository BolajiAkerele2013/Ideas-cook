import React, { useState } from 'react';
import { DollarSign, Calendar, FileText, Upload, X } from 'lucide-react';
import { useEnhancedTransactions } from '../../hooks/ideas/useEnhancedTransactions';

interface EnhancedTransactionFormProps {
  ideaId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function EnhancedTransactionForm({ ideaId, onSuccess, onCancel }: EnhancedTransactionFormProps) {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    is_recurring: false
  });
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const { addTransaction, loading, error } = useEnhancedTransactions(ideaId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await addTransaction({
      ...formData,
      amount: parseFloat(formData.amount),
      attachment_file: attachmentFile || undefined
    });

    if (result.success) {
      onSuccess();
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, JPEG, and PDF files are allowed');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB');
      return;
    }

    setAttachmentFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Transaction</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transaction Type
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="income"
                checked={formData.type === 'income'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Income</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">Expense</span>
            </label>
          </div>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Amount
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-1" />
            Description/Narration
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter transaction description..."
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select category</option>
            <option value="Marketing">Marketing</option>
            <option value="Development">Development</option>
            <option value="Operations">Operations</option>
            <option value="Legal">Legal</option>
            <option value="Equipment">Equipment</option>
            <option value="Travel">Travel</option>
            <option value="Office Supplies">Office Supplies</option>
            <option value="Software">Software</option>
            <option value="Consulting">Consulting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Recurring (for expenses only) */}
        {formData.type === 'expense' && (
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.is_recurring}
                onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">This is a recurring expense</span>
            </label>
          </div>
        )}

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Upload className="inline h-4 w-4 mr-1" />
            Attachment (Optional)
          </label>
          
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {attachmentFile ? (
              <div className="flex items-center justify-between bg-gray-50 rounded p-3">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{attachmentFile.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(attachmentFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachmentFile(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Drop files here or click to upload
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept=".jpg,.jpeg,.pdf"
                      onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, JPEG, PDF up to 2MB
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}