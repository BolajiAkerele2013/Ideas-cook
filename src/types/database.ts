// Add to existing types
export interface Flowchart {
  id: string;
  idea_id: string;
  name: string;
  description?: string;
  category: string;
  data: any;
  created_at: string;
  updated_at: string;
  created_by: string;
  created_by_name?: string;
}

export interface FlowchartNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: { label: string };
}