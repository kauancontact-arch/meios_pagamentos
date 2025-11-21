import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageSquare, Calendar, Users, Wrench, Newspaper, Briefcase, TrendingUp, Award, Target } from 'lucide-react';
import { CommunityRanking } from '@/components/home/CommunityRanking';
import { mockCommunityStats, mockCategoryStats } from '@/mocks/communityStats';

export function HomePage() {
  const { currentUser } = useAppContext();

  const fullName = currentUser ? [currentUser.first_name, currentUser.last_name].filter(Boolean).join(' ') : 'Usuário';
  const firstName = fullName.split(' ')[0];

  const quickStats = [
    {
      title: 'Tópicos no Fórum',
      value: mockCommunityStats.totalTopics,
      icon: MessageSquare,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Trilhas Disponíveis',
      value: mockCommunityStats.totalTracks,
      icon: BookOpen,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Eventos Ativos',
      value: mockCommunityStats.totalEvents,
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Ferramentas',
      value: mockCommunityStats.totalTools,
      icon: Wrench,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  const communityHighlights = [
    {
      title: 'Membros Ativos',
      value: mockCommunityStats.activeUsers,
      total: mockCommunityStats.totalUsers,
      icon: Users,
      description: `${Math.round((mockCommunityStats.activeUsers / mockCommunityStats.totalUsers) * 100)}% da comunidade`,
    },
    {
      title: 'Posts no Fórum',
      value: mockCommunityStats.totalPosts,
      icon: MessageSquare,
      description: 'Discussões ativas',
    },
    {
      title: 'Vagas Publicadas',
      value: mockCommunityStats.totalJobs,
      icon: Briefcase,
      description: 'Oportunidades de carreira',
    },
    {
      title: 'Notícias Publicadas',
      value: mockCommunityStats.totalNews,
      icon: Newspaper,
      description: 'Atualizações do setor',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Bem-vindo(a), {firstName}!</h1>
        <p className="text-gray-500">Aqui está um resumo da sua comunidade hoje.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {communityHighlights.map((highlight) => (
          <Card key={highlight.title}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <highlight.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{highlight.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{highlight.title}</p>
                  <p className="text-xs text-gray-400">{highlight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border-l-4 border-blue-500">
              <MessageSquare className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Novo tópico no fórum</p>
                <p className="text-sm text-gray-600">"Discussão sobre Pix Instantâneo" - 5 respostas</p>
                <p className="text-xs text-gray-500">há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border-l-4 border-green-500">
              <BookOpen className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Trilha concluída</p>
                <p className="text-sm text-gray-600">Maria Silva completou "Fundamentos de Pagamentos"</p>
                <p className="text-xs text-gray-500">há 4 horas</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border-l-4 border-purple-500">
              <Calendar className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">Novo evento</p>
                <p className="text-sm text-gray-600">Workshop: "Open Finance na Prática" - amanhã</p>
                <p className="text-xs text-gray-500">há 6 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Suas Estatísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-2xl font-bold text-primary">{currentUser?.xp || 0}</p>
                <p className="text-sm text-gray-500">XP Total</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-gray-50">
                <p className="text-2xl font-bold text-green-600">{currentUser?.badges?.length || 0}</p>
                <p className="text-sm text-gray-500">Conquistas</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progresso no nível</span>
                <span className="text-sm font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600 mb-2">Próximas conquistas:</p>
              <div className="flex flex-wrap gap-1">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Primeiro Post</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Mentor</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Especialista</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Community Ranking */}
      <CommunityRanking categoryStats={mockCategoryStats} />
    </div>
  );
}