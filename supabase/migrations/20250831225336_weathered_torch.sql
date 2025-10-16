/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `plan_type` (text, default 'free')
      - `days_clean` (integer, default 0)
      - `money_saved` (integer, default 0)
      - `time_saved` (integer, default 0)
      - `daily_bet_average` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policies for authenticated users to manage their own data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  plan_type text DEFAULT 'free' NOT NULL CHECK (plan_type IN ('free', 'premium')),
  days_clean integer DEFAULT 0 NOT NULL,
  money_saved integer DEFAULT 0 NOT NULL,
  time_saved integer DEFAULT 0 NOT NULL,
  daily_bet_average integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);