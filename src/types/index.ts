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