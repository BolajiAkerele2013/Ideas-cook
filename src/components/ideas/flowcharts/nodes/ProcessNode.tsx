import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const ProcessNode = memo(({ data }: NodeProps) => {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center">
        <div className="ml-2">
          <div className="text-sm font-medium text-gray-900">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

ProcessNode.displayName = 'ProcessNode';