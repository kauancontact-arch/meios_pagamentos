import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, TrendingUp, Users, Star, Award } from 'lucide-react';
import { CategoryStats, UserRanking } from '@/mocks/communityStats';

interface CommunityRankingProps {
  categoryStats: CategoryStats[];
}

const categoryColors = {
  forum: 'bg-blue-100 text-blue-800',
  tracks: 'bg-green-100 text-green-800',
  events: 'bg-purple-100 text-purple-800',
  mentorship: 'bg-orange-100 text-orange-800',
  tools: 'bg-red-100 text-red-800',
};

const levelColors = {
  Beginner: 'bg-gray-100 text-gray-800',
  Intermediate: 'bg-blue-100 text-blue-800',
  Advanced: 'bg-green-100 text-green-800',
  Expert: 'bg-purple-100 text-purple-800',
  Master: 'bg-yellow-100 text-yellow-800',
};

export function CommunityRanking({ categoryStats }: CommunityRankingProps) {
  const sortedCategories = categoryStats.sort((a, b) => b.totalActivity - a.totalActivity);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🏆 Ranking da Comunidade</h2>
        <p className="text-gray-500">Veja quem está se destacando em cada categoria</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Categorias Mais Ativas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedCategories.map((category, index) => (
              <div key={category.category} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-lg">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="text-2xl">{category.icon}</div>
                  <div>
                    <p className="font-medium text-gray-800">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.recentActivity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{category.totalActivity.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{category.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Users by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Destaques por Categoria
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedCategories.slice(0, 3).map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium text-gray-800">{category.name}</span>
                  <Badge variant="secondary" className={categoryColors[category.category]}>
                    {category.totalActivity} atividades
                  </Badge>
                </div>
                {category.topUsers.slice(0, 1).map((user) => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatarUrl} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{user.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={levelColors[user.level]}>
                          {user.level}
                        </Badge>
                        <span className="text-sm text-gray-500">{user.xp} XP</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{user.achievements}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Overall Top Contributors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Top Contribuidores Gerais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoryStats
              .flatMap(cat => cat.topUsers)
              .sort((a, b) => b.xp - a.xp)
              .slice(0, 6)
              .map((user, index) => (
                <div key={`${user.category}-${user.id}`} className="flex items-center gap-3 p-3 rounded-lg border">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-sm font-bold">
                    {index + 1}
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{user.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {user.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{user.xp} XP</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}