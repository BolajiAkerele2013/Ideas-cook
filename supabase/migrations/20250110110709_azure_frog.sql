/*
  # Add default conversation settings

  1. Changes
    - Add function to automatically create default settings
    - Add trigger to create settings when user joins conversation
  
  2. Security
    - Maintain existing RLS policies
*/

-- Function to create default conversation settings
CREATE OR REPLACE FUNCTION create_default_conversation_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO conversation_settings (conversation_id, user_id)
  VALUES (NEW.conversation_id, NEW.user_id)
  ON CONFLICT (conversation_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically create settings
CREATE TRIGGER create_conversation_settings_trigger
  AFTER INSERT ON conversation_participants
  FOR EACH ROW
  EXECUTE FUNCTION create_default_conversation_settings();

-- Add unique constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'conversation_settings_conversation_user_unique'
  ) THEN
    ALTER TABLE conversation_settings
    ADD CONSTRAINT conversation_settings_conversation_user_unique 
    UNIQUE (conversation_id, user_id);
  END IF;
END $$;