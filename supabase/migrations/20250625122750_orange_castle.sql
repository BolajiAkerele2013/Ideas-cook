/*
  # Comprehensive Feature Implementation

  1. New Tables
    - `idea_ndas` - Store customizable NDAs for ideas
    - `nda_acceptances` - Track NDA acceptances by contractors
    - `debt_records` - Store debt financier information
    - `transaction_attachments` - Store transaction file attachments

  2. Updates
    - Add attachment support to transactions table
    - Add recurring flag for expenses
    - Create storage buckets for attachments

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for each table
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('transaction-attachments', 'transaction-attachments', false),
  ('nda-documents', 'nda-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Idea NDAs table
CREATE TABLE IF NOT EXISTS idea_ndas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(idea_id)
);

-- NDA acceptances table
CREATE TABLE IF NOT EXISTS nda_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  accepted_at timestamptz DEFAULT now(),
  UNIQUE(idea_id, user_id)
);

-- Debt records table
CREATE TABLE IF NOT EXISTS debt_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  financier_id uuid REFERENCES profiles(id),
  debt_date timestamptz NOT NULL,
  amount numeric NOT NULL,
  repayment_mode text NOT NULL,
  full_repayment_date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Add columns to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS is_recurring boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS attachment_url text;

-- Enable RLS
ALTER TABLE idea_ndas ENABLE ROW LEVEL SECURITY;
ALTER TABLE nda_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE debt_records ENABLE ROW LEVEL SECURITY;

-- Idea NDAs policies
CREATE POLICY "Members can view idea NDAs"
  ON idea_ndas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = idea_ndas.idea_id
      AND idea_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage idea NDAs"
  ON idea_ndas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = idea_ndas.idea_id
      AND idea_members.user_id = auth.uid()
      AND idea_members.role = 'owner'
    )
  );

-- NDA acceptances policies
CREATE POLICY "Users can view their own NDA acceptances"
  ON nda_acceptances FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can accept NDAs"
  ON nda_acceptances FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Owners can view NDA acceptances for their ideas"
  ON nda_acceptances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = nda_acceptances.idea_id
      AND idea_members.user_id = auth.uid()
      AND idea_members.role = 'owner'
    )
  );

-- Debt records policies
CREATE POLICY "Members can view debt records"
  ON debt_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = debt_records.idea_id
      AND idea_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can manage debt records"
  ON debt_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM idea_members
      WHERE idea_members.idea_id = debt_records.idea_id
      AND idea_members.user_id = auth.uid()
      AND idea_members.role = 'owner'
    )
  );

-- Storage policies for transaction attachments
CREATE POLICY "Users can view transaction attachments for their ideas"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'transaction-attachments' AND
    EXISTS (
      SELECT 1 FROM transactions t
      JOIN idea_members im ON im.idea_id = t.idea_id
      WHERE t.attachment_url LIKE '%' || name || '%'
      AND im.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can upload transaction attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'transaction-attachments' AND
    auth.uid() IS NOT NULL
  );

-- Storage policies for NDA documents
CREATE POLICY "Users can view NDA documents for their ideas"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'nda-documents' AND
    EXISTS (
      SELECT 1 FROM idea_ndas n
      JOIN idea_members im ON im.idea_id = n.idea_id
      WHERE n.content LIKE '%' || name || '%'
      AND im.user_id = auth.uid()
    )
  );

CREATE POLICY "Owners can upload NDA documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'nda-documents' AND
    auth.uid() IS NOT NULL
  );