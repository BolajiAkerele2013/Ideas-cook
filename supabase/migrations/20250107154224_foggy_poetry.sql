/*
  # Add flowcharts functionality
  
  1. New Tables
    - `flowcharts`
      - `id` (uuid, primary key)
      - `idea_id` (uuid, references ideas)
      - `name` (text)
      - `description` (text, nullable)
      - `category` (text)
      - `data` (jsonb)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `flowcharts` table
    - Add policies for:
      - View permissions for idea members
      - Edit permissions for users with write access
*/

-- Create flowcharts table
CREATE TABLE IF NOT EXISTS flowcharts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  data jsonb NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE flowcharts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Members can view idea flowcharts"
  ON flowcharts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = flowcharts.idea_id
      AND idea_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = flowcharts.idea_id
      AND ideas.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users with write access can manage flowcharts"
  ON flowcharts FOR ALL
  USING (
    -- Allow if user is idea creator
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = flowcharts.idea_id
      AND ideas.creator_id = auth.uid()
    )
    OR
    -- Allow if user has appropriate role
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = flowcharts.idea_id
      AND idea_members.user_id = auth.uid()
      AND idea_members.role IN ('owner', 'equity_owner', 'contractor')
    )
  );