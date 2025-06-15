/*
  # Add idea management tables

  1. New Tables
    - tasks: Kanban board tasks
    - transactions: Financial transactions
    - invoices: Invoice management
  
  2. Security
    - Enable RLS on all tables
    - Add policies for idea members
*/

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'Todo',
  assigned_to uuid REFERENCES profiles(id),
  due_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('income', 'expense')),
  amount decimal NOT NULL,
  description text NOT NULL,
  date timestamptz NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  number text NOT NULL,
  client text NOT NULL,
  amount decimal NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  due_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Tasks policies
CREATE POLICY "Members can view idea tasks"
  ON tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = tasks.idea_id
      AND idea_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can manage idea tasks"
  ON tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = tasks.idea_id
      AND idea_members.user_id = auth.uid()
    )
  );

-- Transactions policies
CREATE POLICY "Members can view idea transactions"
  ON transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = transactions.idea_id
      AND idea_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage transactions"
  ON transactions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = transactions.idea_id
      AND idea_members.user_id = auth.uid()
      AND idea_members.role IN ('owner', 'equity_owner')
    )
  );

-- Invoices policies
CREATE POLICY "Members can view idea invoices"
  ON invoices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = invoices.idea_id
      AND idea_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage invoices"
  ON invoices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = invoices.idea_id
      AND idea_members.user_id = auth.uid()
      AND idea_members.role IN ('owner', 'equity_owner')
    )
  );