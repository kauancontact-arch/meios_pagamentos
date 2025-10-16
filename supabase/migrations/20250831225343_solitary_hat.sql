/*
  # Create community tables

  1. New Tables
    - `community_posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `content` (text)
      - `likes` (integer, default 0)
      - `comments` (integer, default 0)
      - `created_at` (timestamp)
    - `post_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `post_id` (uuid, references community_posts)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to interact with posts
*/

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  likes integer DEFAULT 0 NOT NULL,
  comments integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, post_id)
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Community posts policies
CREATE POLICY "Anyone can view community posts"
  ON community_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON community_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON community_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON community_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Anyone can view post likes"
  ON post_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike posts"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);