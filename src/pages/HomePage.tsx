import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Star,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { mockCommunityStats, mockCategoryStats } from '@/mocks/communityStats';
import { CommunityRanking } from '@/components/home/CommunityRanking';

export function HomePage() {
  const { currentUser, navigate } = useAppContext();

  const quickStats = [
    {
      title: 'XP Total',
      value: currentUser?.xp || 0,
      icon: Award,
      bgColor: 'bg-yellow-100',
      color: 'text-yellow-600'
    },
    {
      title: 'Tópicos Criados',
      value: 5,
      icon: MessageSquare,
      bgColor: 'bg-blue-100',
      color: 'text-blue-600'
    },
    {
      title: 'Trilhas Concluídas',
      value: 2,
      icon: BookOpen,
      bgColor: 'bg-green-100',
      color: 'text-green-600'
    },
    {
      title: 'Eventos Participados',
      value: 3,
      icon: Calendar,
      bgColor: 'bg-purple-100',
      color: 'text-purple-600'
    }
  ];

  const recentActivity = [
    {
      type: 'forum',
      title: 'Novo tópico em "Autorização de Cartão"',
      time: '2 horas atrás',
      icon: MessageSquare
    },
    {
      type: 'track',
      title: 'Concluiu módulo "ISO 8583 Básico"',
      time: '1 dia atrás',
      icon: BookOpen
    },
    {
      type: 'event',
      title: 'Participou do evento "Workshop Pix"',
      time: '3 dias atrás',
      icon: Calendar
    }
  ];

  const upcomingEvents = [
    {
      title: 'Workshop: Antecipação de Recebíveis',
      date: '15 Dez',
      time: '14:00',
      attendees: 45
    },
    {
      title: 'Meetup: Open Finance',
      date: '20 Dez',
      time: '19:00',
      attendees: 67
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Bem-vindo de volta, {currentUser?.first_name || 'Usuário'}! 👋
            </h1>
            <p className="text-gray-600">
              Continue sua jornada no mundo dos pagamentos digitais
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Seu progresso</p>
                <p className="text-lg font-bold text-primary">75%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Activity & Upcoming Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Atividade Recente</h2>
                <Button variant="ghost" size="sm">
                  Ver tudo
                </Button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <activity.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Próximos Eventos</h2>
                <Button variant="ghost" size="sm" onClick={() => navigate('events')}>
                  Ver todos <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold text-primary">{event.date.split(' ')[0]}</p>
                        <p className="text-xs text-gray-500">{event.date.split(' ')[1]}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{event.title}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {event.attendees}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm">Inscrever-se</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions & Community Stats */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('forum')}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Criar Novo Tópico
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('tracks')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explorar Trilhas
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('events')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Ver Eventos
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => navigate('mentors')}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Encontrar Mentores
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Comunidade</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Membros ativos</span>
                  <span className="font-bold text-primary">{mockCommunityStats.activeUsers}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tópicos hoje</span>
                  <span className="font-bold text-primary">{mockCommunityStats.totalPosts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Eventos ativos</span>
                  <span className="font-bold text-primary">{mockCommunityStats.totalEvents}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Community Ranking */}
      <CommunityRanking categoryStats={mockCategoryStats} />
    </div>
  );
}