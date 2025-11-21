import { Home, MessageSquare, BookOpen, Calendar, Users, Wrench, Newspaper, Briefcase } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const navItems = [
  { name: 'Home', icon: Home, screen: 'home' },
  { name: 'Fórum', icon: MessageSquare, screen: 'forum' },
  { name: 'Trilhas', icon: BookOpen, screen: 'tracks' },
  { name: 'Eventos', icon: Calendar, screen: 'events' },
  { name: 'Mentores', icon: Users, screen: 'mentors' },
  { name: 'Ferramentas', icon: Wrench, screen: 'tools' },
  { name: 'Notícias', icon: Newspaper, screen: 'news' },
  { name: 'Empregos', icon: Briefcase, screen: 'jobs' },
];

export function Sidebar() {
  const { currentScreen, navigate } = useAppContext();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-lg">
          P
        </div>
        <h1 className="font-bold text-xl text-gray-800">Pagamentos</h1>
      </div>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => navigate(item.screen as any)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentScreen === item.screen
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </button>
        ))}
      </nav>
    </aside>
  );
}