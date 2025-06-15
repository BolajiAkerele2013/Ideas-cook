/*
  # Fix idea members policies

  1. Changes
    - Replace recursive policy with direct ownership check
    - Add policy for idea creators
    - Simplify member access checks
  
  2. Security
    - Members can view other members of ideas they belong to
    - Idea creators have full access to manage members
    - Members can view their own membership details
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Members can view idea memberships" ON idea_members;
DROP POLICY IF EXISTS "Only idea owners can manage members" ON idea_members;

-- Create new policies
CREATE POLICY "Creators can manage idea members"
  ON idea_members
  USING (
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = idea_members.idea_id
      AND ideas.creator_id = auth.uid()
    )
  );

CREATE POLICY "Members can view team members"
  ON idea_members FOR SELECT
  USING (
    -- Allow if user is the creator of the idea
    EXISTS (
      SELECT 1 FROM ideas
      WHERE ideas.id = idea_members.idea_id
      AND ideas.creator_id = auth.uid()
    )
    OR
    -- Allow if user is a member of the idea
    EXISTS (
      SELECT 1 FROM idea_members AS im
      WHERE im.idea_id = idea_members.idea_id
      AND im.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own memberships"
  ON idea_members FOR SELECT
  USING (user_id = auth.uid());