export interface CommunityStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalTopics: number;
  totalEvents: number;
  totalTracks: number;
  totalTools: number;
  totalNews: number;
  totalJobs: number;
}

export interface UserRanking {
  id: string;
  name: string;
  avatarUrl: string;
  xp: number;
  level: string;
  category: 'forum' | 'tracks' | 'events' | 'mentorship' | 'tools';
  achievements: number;
  rank: number;
}

export interface CategoryStats {
  category: string;
  name: string;
  icon: string;
  totalActivity: number;
  topUsers: UserRanking[];
  recentActivity: string;
  growth: number;
}

export const mockCommunityStats: CommunityStats = {
  totalUsers: 1250,
  activeUsers: 890,
  totalPosts: 3450,
  totalTopics: 234,
  totalEvents: 45,
  totalTracks: 28,
  totalTools: 12,
  totalNews: 156,
  totalJobs: 67,
};

export const mockUserRankings: UserRanking[] = [
  {
    id: 'user-1',
    name: 'Ana Silva',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-1',
    xp: 2850,
    level: 'Expert',
    category: 'forum',
    achievements: 15,
    rank: 1,
  },
  {
    id: 'user-2',
    name: 'Bruno Costa',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-2',
    xp: 2450,
    level: 'Advanced',
    category: 'tracks',
    achievements: 12,
    rank: 2,
  },
  {
    id: 'user-3',
    name: 'Carla Santos',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-3',
    xp: 2200,
    level: 'Advanced',
    category: 'events',
    achievements: 10,
    rank: 3,
  },
  {
    id: 'user-4',
    name: 'Diego Oliveira',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-4',
    xp: 2100,
    level: 'Advanced',
    category: 'mentorship',
    achievements: 8,
    rank: 4,
  },
  {
    id: 'user-5',
    name: 'Elena Fernandes',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-5',
    xp: 1950,
    level: 'Intermediate',
    category: 'tools',
    achievements: 9,
    rank: 5,
  },
];

export const mockCategoryStats: CategoryStats[] = [
  {
    category: 'forum',
    name: 'Fórum',
    icon: '💬',
    totalActivity: 3450,
    topUsers: mockUserRankings.filter(u => u.category === 'forum'),
    recentActivity: '23 tópicos ativos hoje',
    growth: 15.2,
  },
  {
    category: 'tracks',
    name: 'Trilhas de Aprendizado',
    icon: '🎓',
    totalActivity: 1250,
    topUsers: mockUserRankings.filter(u => u.category === 'tracks'),
    recentActivity: '8 trilhas concluídas hoje',
    growth: 22.1,
  },
  {
    category: 'events',
    name: 'Eventos',
    icon: '📅',
    totalActivity: 890,
    topUsers: mockUserRankings.filter(u => u.category === 'events'),
    recentActivity: '3 eventos acontecendo agora',
    growth: 8.7,
  },
  {
    category: 'mentorship',
    name: 'Mentoria',
    icon: '👥',
    totalActivity: 567,
    topUsers: mockUserRankings.filter(u => u.category === 'mentorship'),
    recentActivity: '12 sessões de mentoria hoje',
    growth: 31.5,
  },
  {
    category: 'tools',
    name: 'Ferramentas',
    icon: '🛠️',
    totalActivity: 2340,
    topUsers: mockUserRankings.filter(u => u.category === 'tools'),
    recentActivity: '45 ferramentas usadas hoje',
    growth: 18.9,
  },
];