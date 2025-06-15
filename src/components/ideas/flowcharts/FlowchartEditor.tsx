import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeTypes,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X, Save, Download } from 'lucide-react';
import { FormInput } from '../../forms/FormInput';
import { TextArea } from '../../forms/TextArea';
import { Select } from '../../forms/Select';
import { useFlowchartEditor } from '../../../hooks/ideas/useFlowchartEditor';
import { FlowchartToolbox } from './FlowchartToolbox';
import { ProcessNode } from './nodes/ProcessNode';
import { DecisionNode } from './nodes/DecisionNode';
import { StartEndNode } from './nodes/StartEndNode';

const FLOWCHART_CATEGORIES = [
  'Business Process',
  'IT Systems',
  'Financial Workflow',
  'Marketing Campaign',
  'Other',
];

const nodeTypes: NodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  startEnd: StartEndNode,
};

interface FlowchartEditorProps {
  ideaId: string;
  flowchartId?: string | null;
  onClose: () => void;
}

export function FlowchartEditor({ ideaId, flowchartId, onClose }: FlowchartEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  const { saveFlowchart, loading, error } = useFlowchartEditor(ideaId);

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#6366f1' } }, eds));
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `New ${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const handleSave = async () => {
    if (!name || !category) return;

    const success = await saveFlowchart({
      id: flowchartId,
      name,
      description,
      category,
      data: { nodes, edges },
    });

    if (success) {
      onClose();
    }
  };

  const handleExport = () => {
    const data = {
      nodes,
      edges,
      name,
      description,
      category,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1 space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1">
                <FormInput
                  id="name"
                  label="Flowchart Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="w-48">
                <Select
                  id="category"
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={FLOWCHART_CATEGORIES}
                />
              </div>
            </div>
            <TextArea
              id="description"
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required={false}
            />
          </div>
          <div className="flex items-center space-x-4 ml-4">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !name || !category}
              className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center p-2 border border-transparent rounded-md text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
        >
          <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
            <FlowchartToolbox />
          </Panel>
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}