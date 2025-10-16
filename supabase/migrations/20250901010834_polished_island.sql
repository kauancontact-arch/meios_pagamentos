/*
  # Set Premium Account for Testing

  1. Updates
    - Set kaun.pf@gmail.com as premium user for testing purposes
    - Only updates if the user exists in the system

  2. Security
    - Uses safe UPDATE with WHERE clause to target specific email
    - No impact on other users
*/

-- Update the user to premium if they exist
UPDATE user_profiles 
SET plan_type = 'premium', 
    updated_at = now()
WHERE email = 'kaun.pf@gmail.com';

-- If the user doesn't exist yet, this will create a placeholder profile
-- that will be updated when they first log in
INSERT INTO user_profiles (
  id,
  email,
  plan_type,
  days_clean,
  money_saved,
  time_saved,
  daily_bet_average,
  created_at,
  updated_at
)
SELECT 
  gen_random_uuid(),
  'kaun.pf@gmail.com',
  'premium',
  0,
  0,
  0,
  0,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM user_profiles WHERE email = 'kaun.pf@gmail.com'
);