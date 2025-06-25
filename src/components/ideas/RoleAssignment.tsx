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

const REPAYMENT_MODES = [
  'lump_sum',
  'monthly_installments',
  'quarterly_installments',
  'annual_installments',
  'revenue_based',
  'equity_conversion'
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
  const [debtAmount, setDebtAmount] = useState('');
  const [debtDate, setDebtDate] = useState('');
  const [repaymentMode, setRepaymentMode] = useState('');
  const [fullRepaymentDate, setFullRepaymentDate] = useState('');
  const { assignRole, loading, error } = useAssignRole();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await assignRole({
      ideaId,
      email,
      role,
      equityPercentage: role === 'equity_owner' ? Number(equity) : undefined,
      expiresAt: role === 'contractor' ? expiresAt : undefined,
      debtAmount: role === 'debt_financier' ? Number(debtAmount) : undefined,
      debtDate: role === 'debt_financier' ? debtDate : undefined,
      repaymentMode: role === 'debt_financier' ? repaymentMode : undefined,
      fullRepaymentDate: role === 'debt_financier' ? fullRepaymentDate : undefined,
    });

    if (success) {
      setEmail('');
      setRole('');
      setEquity('');
      setExpiresAt('');
      setDebtAmount('');
      setDebtDate('');
      setRepaymentMode('');
      setFullRepaymentDate('');
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
          />
        )}

        {role === 'contractor' && (
          <FormInput
            id="expiresAt"
            label="Access Expires At"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            required={false}
          />
        )}

        {role === 'debt_financier' && (
          <>
            <FormInput
              id="debtAmount"
              label="Debt Amount"
              type="number"
              value={debtAmount}
              onChange={(e) => setDebtAmount(e.target.value)}
            />

            <FormInput
              id="debtDate"
              label="Date of Debt"
              type="date"
              value={debtDate}
              onChange={(e) => setDebtDate(e.target.value)}
            />

            <div>
              <label htmlFor="repaymentMode" className="block text-sm font-medium text-gray-700">
                Mode of Repayment
              </label>
              <select
                id="repaymentMode"
                required
                value={repaymentMode}
                onChange={(e) => setRepaymentMode(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select repayment mode</option>
                {REPAYMENT_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <FormInput
              id="fullRepaymentDate"
              label="Date of Full Repayment"
              type="date"
              value={fullRepaymentDate}
              onChange={(e) => setFullRepaymentDate(e.target.value)}
            />
          </>
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