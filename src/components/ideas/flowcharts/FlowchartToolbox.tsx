import React from 'react';
import { Square, Diamond, Circle, ArrowRight } from 'lucide-react';

const tools = [
  { type: 'process', icon: Square, label: 'Process' },
  { type: 'decision', icon: Diamond, label: 'Decision' },
  { type: 'startEnd', icon: Circle, label: 'Start/End' },
];

export function FlowchartToolbox() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-900">Toolbox</h3>
      <div className="space-y-2">
        {tools.map(({ type, icon: Icon, label }) => (
          <div
            key={type}
            className="flex items-center p-2 bg-white border border-gray-200 rounded cursor-move hover:bg-gray-50"
            draggable
            onDragStart={(e) => onDragStart(e, type)}
          >
            <Icon className="h-5 w-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}