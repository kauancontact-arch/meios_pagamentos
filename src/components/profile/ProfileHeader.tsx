import { User } from '@/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, MapPin } from 'lucide-react';

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'Usuário';

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <Avatar className="w-24 h-24 border-4 border-primary">
          <AvatarImage src={user.avatar_url} alt={fullName} />
          <AvatarFallback className="text-3xl">{fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">{fullName}</h1>
          {user.title && user.company && (
            <p className="text-lg text-primary font-medium">{user.title} @ {user.company}</p>
          )}
          <div className="flex items-center justify-center md:justify-start gap-4 mt-2 text-sm text-gray-500">
            {user.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
          </div>
        </div>
        <Button>Editar Perfil</Button>
      </div>
      {user.bio && (
        <div className="mt-6 pt-6 border-t">
          <h2 className="font-semibold text-gray-700 mb-2">Sobre</h2>
          <p className="text-gray-600">{user.bio}</p>
        </div>
      )}
    </div>
  );
}