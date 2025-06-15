/*
  # Add investment and purchase columns to forum_threads

  1. Changes
    - Add `is_looking_to_invest` column to forum_threads
    - Add `is_looking_to_buy` column to forum_threads

  2. Notes
    - Both columns default to false
    - Safe migration that adds columns without affecting existing data
*/

ALTER TABLE forum_threads 
ADD COLUMN IF NOT EXISTS is_looking_to_invest boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_looking_to_buy boolean DEFAULT false;