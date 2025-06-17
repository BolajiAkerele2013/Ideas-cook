export interface Profile {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  created_at: string;
  updated_at: string;
}

export interface Idea {
  id: string;
  creator_id: string;
  name: string;
  description?: string;
  problem_category?: string;
  solution?: string;
  logo_url?: string;
  visibility: boolean;
  created_at: string;
  updated_at: string;
}

export interface IdeaMember {
  id: string;
  idea_id: string;
  user_id: string;
  role: 'owner' | 'equity_owner' | 'debt_financier' | 'contractor' | 'viewer';
  equity_percentage?: number;
  access_expires_at?: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Document {
  id: string;
  idea_id: string;
  name: string;
  description?: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  uploaded_by_name?: string;
  requires_nda: boolean;
  created_at: string;
  updated_at: string;
  category?: string;
}

export interface Task {
  id: string;
  idea_id: string;
  title: string;
  description?: string;
  status: string;
  assigned_to?: string;
  due_date?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  category?: string;
}

export interface Transaction {
  id: string;
  idea_id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  category: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  idea_id: string;
  number: string;
  client: string;
  amount: number;
  status: string;
  due_date: string;
  created_at: string;
}

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

export interface Conversation {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  participants?: any[];
  last_message?: string;
  unread?: boolean;
  is_starred?: boolean;
}