/*
  # Task System Enhancement

  1. New Tables
    - `task_comments` - For task discussion
    - `task_attachments` - For file attachments
    - `task_activities` - For tracking task changes

  2. Changes
    - Add foreign key relationships to tasks table
    - Add tracking columns for task creation and updates

  3. Security
    - Enable RLS on all new tables
    - Add policies for proper access control
*/

-- Add creator and assignee relationships to tasks
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS created_by uuid REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS category text;

-- Task comments table
CREATE TABLE IF NOT EXISTS task_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  content text NOT NULL,
  creator_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Task attachments table
CREATE TABLE IF NOT EXISTS task_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Task activity log table
CREATE TABLE IF NOT EXISTS task_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_activities ENABLE ROW LEVEL SECURITY;

-- Task comments policies
CREATE POLICY "Members can view task comments"
  ON task_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = (
        SELECT idea_id FROM tasks WHERE id = task_comments.task_id
      )
      AND idea_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create task comments"
  ON task_comments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = (
        SELECT idea_id FROM tasks WHERE id = task_comments.task_id
      )
      AND idea_members.user_id = auth.uid()
    )
    AND creator_id = auth.uid()
  );

-- Task attachments policies
CREATE POLICY "Members can view task attachments"
  ON task_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = (
        SELECT idea_id FROM tasks WHERE id = task_attachments.task_id
      )
      AND idea_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Members can manage task attachments"
  ON task_attachments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = (
        SELECT idea_id FROM tasks WHERE id = task_attachments.task_id
      )
      AND idea_members.user_id = auth.uid()
    )
  );

-- Task activities policies
CREATE POLICY "Members can view task activities"
  ON task_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = (
        SELECT idea_id FROM tasks WHERE id = task_activities.task_id
      )
      AND idea_members.user_id = auth.uid()
    )
  );

-- Function to log task activity
CREATE OR REPLACE FUNCTION log_task_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO task_activities (task_id, user_id, description)
  VALUES (
    NEW.id,
    auth.uid(),
    CASE
      WHEN TG_OP = 'INSERT' THEN 'Created task'
      WHEN TG_OP = 'UPDATE' THEN
        CASE
          WHEN NEW.status != OLD.status THEN 'Changed status to ' || NEW.status
          WHEN NEW.assigned_to != OLD.assigned_to THEN 'Updated assignment'
          WHEN NEW.due_date != OLD.due_date THEN 'Updated due date'
          ELSE 'Updated task'
        END
      ELSE 'Modified task'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for task activity logging
CREATE TRIGGER task_activity_trigger
  AFTER INSERT OR UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION log_task_activity();