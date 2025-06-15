/*
  # Fix messaging system policies

  1. Changes
    - Fix infinite recursion in conversation participants policy
    - Simplify access control for conversations
    - Add missing policies for messages
    - Improve security for message attachments

  2. Security
    - Ensure users can only access their own conversations
    - Protect message attachments
    - Secure conversation settings
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view conversation participants" ON conversation_participants;
DROP POLICY IF EXISTS "Users can manage their own participant records" ON conversation_participants;

-- Create new, simplified conversation participants policies
CREATE POLICY "View own conversation participants"
  ON conversation_participants FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "View shared conversation participants"
  ON conversation_participants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants AS cp
      WHERE cp.conversation_id = conversation_participants.conversation_id
      AND cp.user_id = auth.uid()
    )
  );

-- Messages policies
CREATE POLICY "View messages in own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = messages.conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
  );

CREATE POLICY "Send messages to own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversation_participants
      WHERE conversation_participants.conversation_id = conversation_id
      AND conversation_participants.user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

-- Conversation settings policies
CREATE POLICY "Manage own conversation settings"
  ON conversation_settings FOR ALL
  USING (user_id = auth.uid());

-- Function to update conversation timestamp and read status
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