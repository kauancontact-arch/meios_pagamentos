import { Home, MessageSquare, BookOpen, Calendar, Users, Wrench, Newspaper, Briefcase, Book } from 'lucide-react';
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
  { name: 'Glossário', icon: Book, screen: 'glossary' },
];