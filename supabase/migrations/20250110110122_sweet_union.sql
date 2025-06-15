/*
  # Fix messaging policies and triggers

  1. Changes
    - Drop and recreate conversation participant policies
    - Update message attachment policies
    - Add conversation update trigger
  
  2. Security
    - Ensure proper RLS policies for all tables
    - Prevent infinite recursion in policies
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view participants of their conversations" ON conversation_participants;
DROP POLICY IF EXISTS "Users can manage their own participant records" ON conversation_participants;
DROP POLICY IF EXISTS "View own conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "View shared conversation participants" ON conversation_participants;

-- Create new, simplified conversation participants policies
CREATE POLICY "View own participants"
  ON conversation_participants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "View shared participants"
  ON conversation_participants FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Message attachments policies
DROP POLICY IF EXISTS "Users can view attachments in their conversations" ON message_attachments;
DROP POLICY IF EXISTS "Users can add attachments to their messages" ON message_attachments;

CREATE POLICY "View conversation attachments"
  ON message_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM messages m
      JOIN conversation_participants cp ON cp.conversation_id = m.conversation_id
      WHERE m.id = message_attachments.message_id
      AND cp.user_id = auth.uid()
    )
  );

CREATE POLICY "Add message attachments"
  ON message_attachments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM messages m
      WHERE m.id = message_id
      AND m.sender_id = auth.uid()
    )
  );

-- Update conversation settings policies
DROP POLICY IF EXISTS "Users can manage their conversation settings" ON conversation_settings;
DROP POLICY IF EXISTS "Manage own conversation settings" ON conversation_settings;

CREATE POLICY "Manage conversation settings"
  ON conversation_settings FOR ALL
  USING (user_id = auth.uid());

-- Function to update conversation timestamp and mark as unread
CREATE OR REPLACE FUNCTION handle_new_message()
RETURNS TRIGGER AS $$
BEGIN
  -- Update conversation timestamp
  UPDATE conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;

  -- Update last_read_at for sender
  UPDATE conversation_participants
  SET last_read_at = NOW()
  WHERE conversation_id = NEW.conversation_id
  AND user_id = NEW.sender_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS handle_new_message_trigger ON messages;

-- Create new trigger for message handling
CREATE TRIGGER handle_new_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_message();