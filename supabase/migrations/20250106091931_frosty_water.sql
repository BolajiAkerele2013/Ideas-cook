/*
  # Business Templates and Ratings

  1. New Tables
    - `business_templates`
      - Core template information including name, description, category
      - File storage and metadata
      - Rating aggregation
    - `template_ratings`
      - User ratings for templates
      - Constraints to ensure valid ratings

  2. Security
    - Enable RLS on both tables
    - Public read access for templates
    - Authenticated ratings
*/

-- Business templates table
CREATE TABLE IF NOT EXISTS business_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL CHECK (category IN ('finance', 'legal', 'marketing', 'planning', 'project')),
  file_url text NOT NULL,
  average_rating numeric DEFAULT 0 CHECK (average_rating >= 0 AND average_rating <= 5),
  total_ratings integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Template ratings table
CREATE TABLE IF NOT EXISTS template_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid REFERENCES business_templates(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(template_id, user_id)
);

-- Enable RLS
ALTER TABLE business_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Templates are viewable by everyone"
  ON business_templates FOR SELECT
  USING (true);

CREATE POLICY "Only authenticated users can rate templates"
  ON template_ratings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can view their own ratings"
  ON template_ratings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings"
  ON template_ratings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert initial templates
INSERT INTO business_templates (name, description, category, file_url) VALUES
  (
    'Business Plan Template',
    'Comprehensive template with sections for executive summary, market analysis, strategy, and financial projections.',
    'planning',
    'https://example.com/templates/business-plan.docx'
  ),
  (
    'Financial Forecast Template',
    'Spreadsheet template for profit and loss statements, balance sheets, and cash flow projections.',
    'finance',
    'https://example.com/templates/financial-forecast.xlsx'
  ),
  (
    'Non-Disclosure Agreement',
    'Standard NDA template for protecting your intellectual property and confidential information.',
    'legal',
    'https://example.com/templates/nda.docx'
  ),
  (
    'Project Proposal Template',
    'Professional template for presenting project objectives, scope, deliverables, and timelines.',
    'project',
    'https://example.com/templates/project-proposal.docx'
  ),
  (
    'Marketing Plan Template',
    'Detailed template for creating comprehensive marketing strategies and campaigns.',
    'marketing',
    'https://example.com/templates/marketing-plan.docx'
  );

-- Function to update average rating
CREATE OR REPLACE FUNCTION update_template_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE business_templates
  SET 
    average_rating = (
      SELECT AVG(rating)::numeric(3,2)
      FROM template_ratings
      WHERE template_id = NEW.template_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM template_ratings
      WHERE template_id = NEW.template_id
    ),
    updated_at = now()
  WHERE id = NEW.template_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update average rating
CREATE TRIGGER update_template_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON template_ratings
FOR EACH ROW
EXECUTE FUNCTION update_template_rating();