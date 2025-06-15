import React from 'react';
import { useMetrics } from '../../../hooks/ideas/useMetrics';
import { OwnershipChart } from './OwnershipChart';
import { FundingChart } from './FundingChart';
import { TaskMetrics } from './TaskMetrics';

interface MetricsDashboardProps {
  ideaId: string;
}

export function MetricsDashboard({ ideaId }: MetricsDashboardProps) {
  const { metrics, loading, error } = useMetrics(ideaId);

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
        <p className="text-red-600">Failed to load metrics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ownership Distribution</h3>
          <OwnershipChart data={metrics.ownership} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Funding Progress</h3>
          <FundingChart data={metrics.funding} />
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Task Completion</h3>
          <TaskMetrics data={metrics.tasks} />
        </div>
      </div>
    </div>
  );
}