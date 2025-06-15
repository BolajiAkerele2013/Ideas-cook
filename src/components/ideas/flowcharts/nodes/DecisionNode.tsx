import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

export const DecisionNode = memo(({ data }: NodeProps) => {
  return (
    <div className="w-40 h-40 shadow-md bg-white border-2 border-gray-200" style={{ transform: 'rotate(45deg)' }}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" style={{ transform: 'rotate(-45deg)' }} />
      <div className="flex items-center justify-center h-full" style={{ transform: 'rotate(-45deg)' }}>
        <div className="text-sm font-medium text-gray-900">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Left} className="w-3 h-3" style={{ transform: 'rotate(-45deg)' }} />
      <Handle type="source" position={Position.Right} className="w-3 h-3" style={{ transform: 'rotate(-45deg)' }} />
    </div>
  );
});

DecisionNode.displayName = 'DecisionNode';