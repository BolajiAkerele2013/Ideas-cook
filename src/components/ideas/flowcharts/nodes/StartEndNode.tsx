import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const StartEndNode = memo(({ data }: NodeProps) => {
  return (
    <div className="px-8 py-3 rounded-full shadow-md bg-white border-2 border-gray-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center justify-center">
        <div className="text-sm font-medium text-gray-900">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
});

StartEndNode.displayName = 'StartEndNode';