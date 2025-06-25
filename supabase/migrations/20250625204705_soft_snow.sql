/*
  # Update Ideas RLS Policy for Team Member Access

  1. Changes
    - Drop existing public ideas policy
    - Create new policy that restricts access to team members only
    - Allow access if idea is public, user is creator, or user is a team member

  2. Security
    - Ensures only authorized users can access ideas
    - Maintains public visibility for public ideas
    - Protects private ideas from unauthorized access
*/

-- Drop the existing policy
DROP POLICY IF EXISTS "Public ideas are viewable by everyone" ON public.ideas;

-- Create a new policy that allows access if public, or if user is creator, or if user is a member
CREATE POLICY "Members and public can view ideas"
  ON public.ideas FOR SELECT
  USING (
    visibility = true OR
    creator_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.idea_members
      WHERE idea_members.idea_id = ideas.id
      AND idea_members.user_id = auth.uid()
    )
  );