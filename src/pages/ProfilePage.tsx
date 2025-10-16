import { useAppContext } from '@/contexts/AppContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { StatsCard } from '@/components/profile/StatsCard';
import { BadgesList } from '@/components/profile/BadgesList';
import { Award, MessageSquare, BookOpen } from 'lucide-react';

export function ProfilePage() {
  const { currentUser } = useAppContext();

  if (!currentUser) {
    return <div>Carregando perfil...</div>;
  }

  return (
    <div className="space-y-8">
      <ProfileHeader user={currentUser} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="XP Total" value={currentUser.xp} icon={Award} />
        <StatsCard title="Tópicos Criados" value={5} icon={MessageSquare} />
        <StatsCard title="Trilhas Concluídas" value={2} icon={BookOpen} />
      </div>

      <BadgesList badges={currentUser.badges} />
    </div>
  );
}