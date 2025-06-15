import React from 'react';

interface FundingChartProps {
  data: {
    target: number;
    current: number;
    breakdown: {
      category: string;
      amount: number;
    }[];
  };
}

export function FundingChart({ data }: FundingChartProps) {
  const progress = (data.current / data.target) * 100;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-green-600 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Breakdown</h4>
        <div className="space-y-2">
          {data.breakdown.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{item.category}</span>
              <span>${item.amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}