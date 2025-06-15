/*
  # Add thread views increment function
  
  1. New Functions
    - `increment_thread_views`: Safely increments the view count for a forum thread
  
  2. Security
    - Function is accessible to all authenticated users
*/

-- Create function to increment thread views
CREATE OR REPLACE FUNCTION increment_thread_views(thread_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE forum_threads
  SET view_count = view_count + 1
  WHERE id = thread_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_thread_views(uuid) TO authenticated;