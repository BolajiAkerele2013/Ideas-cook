import React from 'react';

interface AuthFormProps {
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  submitText: string;
  loadingText: string;
}

export function AuthForm({ onSubmit, loading, error, children, submitText, loadingText }: AuthFormProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          {children}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? loadingText : submitText}
          </button>
        </form>
      </div>
    </div>
  );
}