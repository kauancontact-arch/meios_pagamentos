/*
  # Add daily check date column

  1. Changes
    - Add `last_daily_check_date` column to `user_profiles` table
    - This column tracks the last date when daily progression was checked
    - Used to ensure days_clean only advances once per calendar day

  2. Security
    - No changes to RLS policies needed
    - Column inherits existing table permissions
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'last_daily_check_date'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN last_daily_check_date date DEFAULT CURRENT_DATE;
  END IF;
END $$;