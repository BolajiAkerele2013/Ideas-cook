/*
  # Update idea members RLS policy for member management

  1. Security Updates
    - Update RLS policy to allow owners and equity_owners to manage team members
    - Ensure proper access control for member removal operations

  2. Changes
    - Modified "Creators can manage idea members" policy to include equity_owner role
    - Allows both owner and equity_owner roles to delete members from ideas
*/

-- Update the existing policy to allow both owners and equity_owners to manage members
DROP POLICY IF EXISTS "Creators can manage idea members" ON public.idea_members;

CREATE POLICY "Owners and equity owners can manage idea members"
  ON public.idea_members
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM idea_members im 
      WHERE im.idea_id = idea_members.idea_id 
      AND im.user_id = auth.uid() 
      AND im.role = ANY (ARRAY['owner'::idea_role, 'equity_owner'::idea_role])
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM idea_members im 
      WHERE im.idea_id = idea_members.idea_id 
      AND im.user_id = auth.uid() 
      AND im.role = ANY (ARRAY['owner'::idea_role, 'equity_owner'::idea_role])
    )
  );