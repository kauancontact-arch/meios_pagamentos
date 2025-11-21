export type UserRole = 'user' | 'mentor' | 'admin';

export interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  bio?: string;
  title?: string;
  company?: string;
  location?: string;
  xp: number;
  roles: UserRole[];
  badges: Badge[];
  updated_at?: string;
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

export interface Track {
  id: string;
  title: string;
  description: string;
  icon: string;
  authorId: string;
  moduleCount: number;
  totalDurationMinutes: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
}

export interface Module {
  id: string;
  trackId: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  durationMinutes: number;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  type: 'remote_meeting' | 'in_person' | 'lecture' | 'workshop' | 'conference';
  start_date: string;
  end_date?: string;
  location?: string;
  remote_link?: string;
  max_attendees?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}