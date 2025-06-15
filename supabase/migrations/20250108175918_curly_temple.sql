/*
  # Add forum functionality
  
  1. New Tables
    - `forum_threads`
      - Core table for discussion threads
      - Includes title, content, category, and creator info
    - `forum_comments`
      - Comments on threads
      - Tracks parent comment for nested replies
    - `forum_likes`
      - Tracks likes on threads and comments
    
  2. Security
    - Enable RLS on all tables
    - Public read access for threads and comments
    - Write access for authenticated users
*/

-- Forum threads table
CREATE TABLE IF NOT EXISTS forum_threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  creator_id uuid REFERENCES profiles(id),
  idea_id uuid REFERENCES ideas(id),
  is_selling boolean DEFAULT false,
  is_seeking_funding boolean DEFAULT false,
  is_seeking_partners boolean DEFAULT false,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum comments table
CREATE TABLE IF NOT EXISTS forum_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES forum_threads(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES forum_comments(id),
  content text NOT NULL,
  creator_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Forum likes table
CREATE TABLE IF NOT EXISTS forum_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  thread_id uuid REFERENCES forum_threads(id),
  comment_id uuid REFERENCES forum_comments(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT likes_target_check CHECK (
    (thread_id IS NOT NULL AND comment_id IS NULL) OR
    (thread_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, thread_id, comment_id)
);

-- Enable Row Level Security
ALTER TABLE forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_likes ENABLE ROW LEVEL SECURITY;

-- Forum threads policies
CREATE POLICY "Forum threads are viewable by everyone"
  ON forum_threads FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create threads"
  ON forum_threads FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own threads"
  ON forum_threads FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own threads"
  ON forum_threads FOR DELETE
  USING (creator_id = auth.uid());

-- Forum comments policies
CREATE POLICY "Forum comments are viewable by everyone"
  ON forum_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON forum_comments FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own comments"
  ON forum_comments FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
  ON forum_comments FOR DELETE
  USING (creator_id = auth.uid());

-- Forum likes policies
CREATE POLICY "Forum likes are viewable by everyone"
  ON forum_likes FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can manage their likes"
  ON forum_likes FOR ALL
  TO authenticated
  USING (user_id = auth.uid());