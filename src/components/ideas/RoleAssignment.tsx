import React, { useState } from 'react';
import { useAssignRole } from '../../hooks/ideas/useAssignRole';
import { FormInput } from '../forms/FormInput';
import { Select } from '../forms/Select';

const ROLES = [
  'equity_owner',
  'debt_financier',
  'contractor',
  'viewer'
];

interface RoleAssignmentProps {
  ideaId: string;
  onAssigned: () => void;
}

export function RoleAssignment({ ideaId, onAssigned }: RoleAssignmentProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [equity, setEquity] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const { assignRole, loading, error } = useAssignRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await assignRole({
      ideaId,
      email,
      role,
      equityPercentage: role === 'equity_owner' ? Number(equity) : undefined,
      expiresAt: role === 'contractor' ? expiresAt : undefined,
    });

    if (success) {
      setEmail('');
      setRole('');
      setEquity('');
      setExpiresAt('');
      onAssigned();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Assign Role</h3>
      </div>
      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {error && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <FormInput
          id="email"
          label="User Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Select
          id="role"
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={ROLES}
        />

        {role === 'equity_owner' && (
          <FormInput
            id="equity"
            label="Equity Percentage"
            type="number"
            value={equity}
            onChange={(e) => setEquity(e.target.value)}
            min="0"
            max="100"
          />
        )}

        {role === 'contractor' && (
          <FormInput
            id="expiresAt"
            label="Access Expires At"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Assigning...' : 'Assign Role'}
        </button>
      </form>
    </div>
  );
}