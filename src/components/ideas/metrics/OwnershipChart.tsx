import React from 'react';

interface OwnershipChartProps {
  data: {
    user: string;
    percentage: number;
  }[];
}

export function OwnershipChart({ data }: OwnershipChartProps) {
  return (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div key={index} className="relative">
          <div className="flex justify-between text-sm mb-1">
            <span>{item.user}</span>
            <span>{item.percentage}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full"
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}