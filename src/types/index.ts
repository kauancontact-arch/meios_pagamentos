export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'basic' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  modules: string[];
  instructor: string;
  rating: number;
  studentsCount: number;
  price: number; // 0 for free
  tags: string[];
  prerequisites: string[]; // course IDs
  completionRate: number; // percentage
  lastUpdated: string;
}