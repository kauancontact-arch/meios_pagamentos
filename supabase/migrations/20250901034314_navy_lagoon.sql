/*
  # Community Features Database Schema

  1. New Tables
    - `post_comments`
      - `id` (uuid, primary key)
      - `post_id` (uuid, foreign key to community_posts)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text, not null)
      - `created_at` (timestamp)
    - `challenges`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `description` (text, not null)
      - `reward` (text, not null)
      - `type` (text, not null)
      - `target_value` (integer, nullable)
      - `is_active` (boolean, default true)
      - `created_at` (timestamp)
    - `user_challenges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `challenge_id` (uuid, foreign key to challenges)
      - `status` (text, default 'enrolled')
      - `completed_at` (timestamp, nullable)
      - `points_awarded` (integer, nullable)
      - `created_at` (timestamp)
      - Unique constraint on (user_id, challenge_id)

  2. Schema Updates
    - Add `points` column to `user_profiles` table

  3. Security
    - Enable RLS on all new tables
    - Add appropriate policies for CRUD operations
    - Ensure users can only manage their own data

  4. Initial Data
    - Insert default challenges (Semana Sem Apostas, Economizador do Mês, Mentor da Comunidade)
*/

-- Create post_comments table
CREATE TABLE IF NOT EXISTS public.post_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for post_comments
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for post_comments
CREATE POLICY "Anyone can view post comments"
ON public.post_comments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can insert their own comments"
ON public.post_comments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
ON public.post_comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
ON public.post_comments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Create challenges table
CREATE TABLE IF NOT EXISTS public.challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    description text NOT NULL,
    reward text NOT NULL,
    type text NOT NULL,
    target_value integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS for challenges
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

-- RLS policies for challenges
CREATE POLICY "Anyone can view challenges"
ON public.challenges FOR SELECT
TO authenticated
USING (true);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS public.user_challenges (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    challenge_id uuid NOT NULL REFERENCES public.challenges(id) ON DELETE CASCADE,
    status text DEFAULT 'enrolled',
    completed_at timestamp with time zone,
    points_awarded integer,
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE (user_id, challenge_id)
);

-- Enable RLS for user_challenges
ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_challenges
CREATE POLICY "Users can view their own challenge progress"
ON public.user_challenges FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll in challenges"
ON public.user_challenges FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own challenge status"
ON public.user_challenges FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add points column to user_profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'points'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN points integer DEFAULT 0;
  END IF;
END $$;

-- Insert default challenges
INSERT INTO public.challenges (title, description, reward, type, target_value, is_active) VALUES
('Semana Sem Apostas', 'Complete 7 dias consecutivos sem apostar', 'Badge Guerreiro + 50 pontos', 'weekly', 7, true),
('Economizador do Mês', 'Economize R$ 1000 em um mês', 'Badge Poupador + 100 pontos', 'monthly', 1000, true),
('Mentor da Comunidade', 'Ajude 50 pessoas com comentários motivacionais', 'Badge Mentor + 200 pontos', 'fixed', 50, true)
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON public.post_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_user_id ON public.user_challenges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_challenges_challenge_id ON public.user_challenges(challenge_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_points ON public.user_profiles(points DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_days_clean ON public.user_profiles(days_clean DESC);