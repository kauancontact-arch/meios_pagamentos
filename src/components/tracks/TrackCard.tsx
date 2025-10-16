import { motion } from 'framer-motion';
import { Track, User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Clock, Book, BarChart3 } from 'lucide-react';
import { Badge } from '../ui/badge';

interface TrackCardProps {
  track: Track;
  author: User;
  onClick: () => void;
}

export function TrackCard({ track, author, onClick }: TrackCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow overflow-hidden">
        <CardHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-3xl">
              {track.icon}
            </div>
            <Badge variant={track.level === 'Iniciante' ? 'secondary' : track.level === 'Intermediário' ? 'default' : 'destructive'}>
              <BarChart3 className="w-3 h-3 mr-1.5" />
              {track.level}
            </Badge>
          </div>
          <CardTitle>{track.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 mb-6">{track.description}</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Book className="w-4 h-4" />
              <span>{track.moduleCount} módulos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{track.totalDurationMinutes} min</span>
            </div>
          </div>
        </CardContent>
        <div className="p-4 bg-gray-50/50 flex items-center justify-between">
           <div className="flex items-center gap-2">
             <Avatar className="w-8 h-8">
               <AvatarImage src={author.avatarUrl} />
               <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
             </Avatar>
             <span className="text-xs font-medium text-gray-700">{author.name}</span>
           </div>
           <Button onClick={onClick} size="sm">Iniciar Trilha</Button>
        </div>
      </Card>
    </motion.div>
  );
}