/*
  # Add last_daily_notification_day to user_profiles

  1. Changes
    - Add `last_daily_notification_day` column to track the last day notifications were sent
    - Set default value to 0 for existing users
    - Add index for performance

  2. Security
    - No changes to RLS policies needed as this is part of existing user_profiles table
*/

-- Add the last_daily_notification_day column
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS last_daily_notification_day integer DEFAULT 0;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_daily_notification 
ON user_profiles(last_daily_notification_day);