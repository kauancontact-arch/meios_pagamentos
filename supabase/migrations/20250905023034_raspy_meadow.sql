/*
  # Create user notifications table

  1. New Tables
    - `user_notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `message` (text)
      - `type` (text, enum: 'motivation', 'achievement', 'milestone', 'warning')
      - `created_at` (timestamptz, default now())
      - `read` (boolean, default false)

  2. Security
    - Enable RLS on `user_notifications` table
    - Add policies for authenticated users to manage their own notifications

  3. Indexes
    - Add index on user_id for faster queries
    - Add index on created_at for ordering
*/

CREATE TABLE IF NOT EXISTS user_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('motivation', 'achievement', 'milestone', 'warning')),
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own notifications"
  ON user_notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notifications"
  ON user_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON user_notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON user_notifications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_notifications_created_at ON user_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_notifications_read ON user_notifications(user_id, read);