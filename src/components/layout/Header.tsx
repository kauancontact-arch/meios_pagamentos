import { Bell, Search, User as UserIcon } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Header() {
  const { currentUser, logout } = useAppContext();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-10">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input placeholder="Busque por tópicos, trilhas, eventos..." className="pl-10 bg-gray-100 border-none" />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
        <div className="flex items-center gap-3">
          <img src={currentUser?.avatarUrl} alt={currentUser?.name} className="w-9 h-9 rounded-full" />
          <div>
            <p className="font-semibold text-sm text-gray-800">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.title}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>Sair</Button>
      </div>
    </header>
  );
}