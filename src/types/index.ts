export type UserRole = 'user' | 'mentor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  bio: string;
  title: string;
  company: string;
  location: string;
  xp: number;
  roles: UserRole[];
  badges: Badge[];
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
}

export interface ForumCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  topicCount: number;
  icon: string;
}

export interface Topic {
  id: string;
  title: string;
  slug: string;
  categoryId: string;
  authorId: string;
  createdAt: string;
  upvotes: number;
  replyCount: number;
  tags: string[];
}

export interface Post {
  id: string;
  topicId: string;
  authorId: string;
  content: string;
  createdAt: string;
  upvotes: number;
  isBestAnswer: boolean;
}