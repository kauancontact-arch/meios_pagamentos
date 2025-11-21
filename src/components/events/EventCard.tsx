import { motion } from 'framer-motion';
import { Event } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Video, Globe, Clock } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const eventTypeLabels = {
  remote_meeting: 'Reunião Remota',
  in_person: 'Presencial',
  lecture: 'Palestra',
  workshop: 'Workshop',
  conference: 'Conferência',
};

const eventTypeIcons = {
  remote_meeting: <Video className="w-5 h-5" />,
  in_person: <MapPin className="w-5 h-5" />,
  lecture: <Globe className="w-5 h-5" />,
  workshop: <Users className="w-5 h-5" />,
  conference: <Globe className="w-5 h-5" />,
};

export function EventCard({ event, onClick, isAdmin, onEdit, onDelete }: EventCardProps) {
  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const now = new Date();
  const isPast = isBefore(startDate, now);
  const isUpcoming = isAfter(startDate, now);

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={onClick}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {eventTypeIcons[event.type]}
              {eventTypeLabels[event.type]}
            </Badge>
            <div className="flex gap-1">
              {isPast && <Badge variant="outline" className="text-xs">Passado</Badge>}
              {isUpcoming && <Badge variant="default" className="text-xs bg-green-600">Próximo</Badge>}
            </div>
          </div>
          <CardTitle className="text-lg">{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          {event.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{event.description}</p>
          )}
          <div className="space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {format(startDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                {endDate && ` - ${format(endDate, "HH:mm", { locale: ptBR })}`}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            )}
            {event.max_attendees && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Máx. {event.max_attendees} participantes</span>
              </div>
            )}
            {endDate && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} min</span>
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-4 bg-gray-50/50 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {isPast ? 'Evento realizado' : isUpcoming ? 'Em breve' : 'Hoje'}
          </div>
          {isAdmin && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" onClick={onEdit}>
                Editar
              </Button>
              <Button variant="ghost" size="sm" onClick={onDelete}>
                Excluir
              </Button>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}