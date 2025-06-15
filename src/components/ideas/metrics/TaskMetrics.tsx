import React from 'react';

interface TaskMetricsProps {
  data: {
    total: number;
    completed: number;
    byStatus: {
      status: string;
      count: number;
    }[];
  };
}

export function TaskMetrics({ data }: TaskMetricsProps) {
  const completionRate = data.total > 0 
    ? Math.round((data.completed / data.total) * 100)
    : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Completion Rate</span>
          <span>{completionRate}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-600 rounded-full"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Status Breakdown</h4>
        <div className="space-y-2">
          {data.byStatus.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.status}</span>
              <span>{item.count} tasks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}