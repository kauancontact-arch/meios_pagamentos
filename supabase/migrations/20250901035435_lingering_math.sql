/*
  # Add relationship between community_posts and user_profiles

  1. Changes
    - Add foreign key constraint linking community_posts.user_id to user_profiles.id
    - This enables Supabase to understand the relationship for queries

  2. Security
    - No changes to existing RLS policies
    - Maintains existing security model
*/

-- Add foreign key constraint to link community_posts to user_profiles
ALTER TABLE community_posts 
ADD CONSTRAINT community_posts_user_id_user_profiles_fkey 
FOREIGN KEY (user_id) REFERENCES user_profiles(id) ON DELETE CASCADE;