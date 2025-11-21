export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'iso8583' | 'conciliation' | 'metrics' | 'settlement' | 'ai' | 'rules' | 'other';
  icon: string;
  status: 'free' | 'premium' | 'beta';
  popularity: number; // 1-5 stars
  usageCount: number;
  features: string[];
  demoUrl?: string;
  isNew?: boolean;
}

export interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  authorId: string;
  publishedAt: string;
  category: 'regulatory' | 'industry' | 'technology' | 'market' | 'company';
  tags: string[];
  imageUrl?: string;
  readTime: number; // in minutes
  featured: boolean;
  views: number;
  likes: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  benefits: string[];
  postedBy: string;
  postedAt: string;
  applicationUrl: string;
  isRemote: boolean;
  experience: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  tags: string[];
  views: number;
  applications: number;
}