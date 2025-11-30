import { Home, MessageSquare, BookOpen, Calendar, Users, Wrench, Newspaper, Briefcase, Book } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', icon: Home, screen: 'home' },
  { name: 'Fórum', icon: MessageSquare, screen: 'forum' },
  { name: 'Trilhas', icon: BookOpen, screen: 'tracks' },
  { name: 'Eventos', icon: Calendar, screen: 'events' },
  { name: 'Mentores', icon: Users, screen: 'mentors' },
  { name: 'Ferramentas', icon: Wrench, screen: 'tools' },
  { name: 'Notícias', icon: Newspaper, screen: 'news' },
  { name: 'Empregos', icon: Briefcase, screen: 'jobs' },
  { name: 'Glossário', icon: Book, screen: 'glossary' },
];

export function Sidebar() {
  const { currentScreen, navigate } = useAppContext();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="font-bold text-gray-800">Pagamentos</h1>
            <p className="text-xs text-gray-500">Comunidade</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Button
              key={item.screen}
              variant={currentScreen === item.screen ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start h-11 px-4',
                currentScreen === item.screen
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              )}
              onClick={() => navigate(item.screen)}
            >
              <div className="flex items-center w-full">
                <item.icon className="w-5 h-5 mr-4 flex-shrink-0" />
                <span className="text-left">{item.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Comunidade de Pagamentos
        </div>
      </div>
    </div>
  );
}