/*
  # Initial Schema Setup for Bezael.com Platform

  1. New Tables
    - `profiles`
      - User profile information
      - Linked to Supabase auth.users
      - Stores additional user data
    
    - `ideas`
      - Core ideas table
      - Stores idea details and metadata
    
    - `idea_members`
      - Manages idea membership and roles
      - Links users to ideas with specific roles
      - Tracks ownership percentages
    
    - `idea_documents`
      - Stores documents related to ideas
      - Manages document metadata and access control

  2. Security
    - Enable RLS on all tables
    - Set up policies for each table based on user roles
    - Implement ownership and access control
*/

-- Profiles table for user information
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  bio text,
  skills text[],
  interests text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ideas table for core idea information
CREATE TABLE IF NOT EXISTS ideas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  description text,
  problem_category text,
  solution text,
  logo_url text,
  visibility boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enum for member roles
CREATE TYPE idea_role AS ENUM (
  'owner',
  'equity_owner',
  'debt_financier',
  'contractor',
  'viewer'
);

-- Idea members table for role management
CREATE TABLE IF NOT EXISTS idea_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  role idea_role NOT NULL,
  equity_percentage decimal CHECK (equity_percentage >= 0 AND equity_percentage <= 100),
  access_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(idea_id, user_id)
);

-- Documents table for idea-related files
CREATE TABLE IF NOT EXISTS idea_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id uuid REFERENCES ideas(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  file_url text NOT NULL,
  file_type text NOT NULL,
  uploaded_by uuid REFERENCES profiles(id),
  requires_nda boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_documents ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Ideas policies
CREATE POLICY "Public ideas are viewable by everyone"
  ON ideas FOR SELECT
  USING (visibility = true OR creator_id = auth.uid());

CREATE POLICY "Creators can update their ideas"
  ON ideas FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Authenticated users can create ideas"
  ON ideas FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Idea members policies
CREATE POLICY "Members can view idea memberships"
  ON idea_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members im
      WHERE im.idea_id = idea_members.idea_id
      AND im.user_id = auth.uid()
    )
  );

CREATE POLICY "Only idea owners can manage members"
  ON idea_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM idea_members im
      WHERE im.idea_id = idea_members.idea_id
      AND im.user_id = auth.uid()
      AND im.role = 'owner'
    )
  );

-- Document policies
CREATE POLICY "Members can view non-NDA documents"
  ON idea_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM idea_members im
      WHERE im.idea_id = idea_documents.idea_id
      AND im.user_id = auth.uid()
    )
    AND (NOT requires_nda OR auth.uid() = uploaded_by)
  );

CREATE POLICY "Only idea owners can manage documents"
  ON idea_documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM idea_members im
      WHERE im.idea_id = idea_documents.idea_id
      AND im.user_id = auth.uid()
      AND im.role = 'owner'
    )
  );