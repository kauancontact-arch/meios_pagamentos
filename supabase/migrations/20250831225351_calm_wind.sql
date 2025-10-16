/*
  # Create user progress table

  1. New Tables
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `lesson_day` (integer)
      - `completed_at` (timestamp)
      - `challenge_completed` (boolean, default false)

  2. Security
    - Enable RLS on `user_progress` table
    - Add policies for authenticated users to manage their own progress
*/

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_day integer NOT NULL,
  completed_at timestamptz DEFAULT now() NOT NULL,
  challenge_completed boolean DEFAULT false NOT NULL,
  UNIQUE(user_id, lesson_day)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
  ON user_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);