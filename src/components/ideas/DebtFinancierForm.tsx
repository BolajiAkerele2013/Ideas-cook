import React, { useState } from 'react';
import { DollarSign, Calendar, CreditCard, User } from 'lucide-react';
import { useDebtFinancier } from '../../hooks/ideas/useDebtFinancier';

interface DebtFinancierFormProps {
  ideaId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function DebtFinancierForm({ ideaId, onSuccess, onCancel }: DebtFinancierFormProps) {
  const [formData, setFormData] = useState({
    user_email: '',
    debt_date: '',
    debt_amount: '',
    repayment_mode: '',
    full_repayment_date: ''
  });
  const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const { addDebtFinancier, loading, error } = useDebtFinancier(ideaId);

  const searchUsers = async (email: string) => {
    if (email.length < 3) {
      setUserSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, first_name, last_name, avatar_url')
        .ilike('username', `%${email}%`)
        .limit(5);

      if (error) throw error;
      setUserSearchResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }

    const result = await addDebtFinancier({
      user_id: selectedUser.id,
      debt_date: formData.debt_date,
      debt_amount: parseFloat(formData.debt_amount),
      repayment_mode: formData.repayment_mode,
      full_repayment_date: formData.full_repayment_date
    });

    if (result.success) {
      onSuccess();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Add Debt Financier</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-1" />
            Search User by Email
          </label>
          <input
            type="email"
            value={formData.user_email}
            onChange={(e) => {
              setFormData({ ...formData, user_email: e.target.value });
              searchUsers(e.target.value);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter user email..."
            required
          />
          
          {userSearchResults.length > 0 && (
            <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
              {userSearchResults.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setSelectedUser(user);
                    setFormData({ ...formData, user_email: user.username });
                    setUserSearchResults([]);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                >
                  {user.avatar_url && (
                    <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full" />
                  )}
                  <div>
                    <p className="font-medium">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500">{user.username}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {selectedUser && (
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Selected: {selectedUser.first_name} {selectedUser.last_name} ({selectedUser.username})
              </p>
            </div>
          )}
        </div>

        {/* Debt Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Date of Debt
          </label>
          <input
            type="date"
            value={formData.debt_date}
            onChange={(e) => setFormData({ ...formData, debt_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Debt Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline h-4 w-4 mr-1" />
            Amount of Debt
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.debt_amount}
            onChange={(e) => setFormData({ ...formData, debt_amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        {/* Repayment Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <CreditCard className="inline h-4 w-4 mr-1" />
            Mode of Repayment
          </label>
          <select
            value={formData.repayment_mode}
            onChange={(e) => setFormData({ ...formData, repayment_mode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select repayment mode</option>
            <option value="lump_sum">Lump Sum</option>
            <option value="monthly_installments">Monthly Installments</option>
            <option value="quarterly_installments">Quarterly Installments</option>
            <option value="annual_installments">Annual Installments</option>
            <option value="revenue_based">Revenue Based</option>
            <option value="equity_conversion">Equity Conversion</option>
          </select>
        </div>

        {/* Full Repayment Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline h-4 w-4 mr-1" />
            Date of Full Repayment
          </label>
          <input
            type="date"
            value={formData.full_repayment_date}
            onChange={(e) => setFormData({ ...formData, full_repayment_date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
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
            disabled={loading || !selectedUser}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Debt Financier'}
          </button>
        </div>
      </form>
    </div>
  );
}