import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { mockEvents } from '@/mocks/events';
import { mockUsers } from '@/mocks/users';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, MapPin, Users, Video, Globe, Clock, UserCheck, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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

export function EventDetailPage() {
  const { screenParams, navigate, currentUser } = useAppContext();
  const { eventId } = screenParams;

  const event = mockEvents.find(e => e.id === eventId);
  const creator = mockUsers.find(u => u.id === event?.created_by);

  // Mock attendance data
  const [isAttending, setIsAttending] = useState(false);
  const [attendees] = useState([
    mockUsers[0], mockUsers[1], mockUsers[2], // Mock attendees
  ]);

  if (!event || !creator) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Evento não encontrado</h1>
        <Button onClick={() => navigate('events')}>Voltar para Eventos</Button>
      </div>
    );
  }

  const startDate = new Date(event.start_date);
  const endDate = event.end_date ? new Date(event.end_date) : null;
  const isPast = startDate < new Date();
  const isAdmin = currentUser?.roles?.includes('admin');

  const handleAttendanceToggle = () => {
    setIsAttending(!isAttending);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" onClick={() => navigate('events')} className="mb-4 text-sm text-gray-600 px-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para todos os eventos
        </Button>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                {eventTypeIcons[event.type]}
                {eventTypeLabels[event.type]}
              </Badge>
              {isPast && <Badge variant="outline">Evento Passado</Badge>}
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{event.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(startDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  {endDate && ` - ${format(endDate, "HH:mm", { locale: ptBR })}`}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>
                  {endDate ? 
                    `${Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60))} min` : 
                    'Duração não definida'
                  }
                </span>
              </div>
            </div>
          </div>
          {!isPast && (
            <Button 
              onClick={handleAttendanceToggle}
              variant={isAttending ? "outline" : "default"}
              className="flex items-center gap-2"
            >
              {isAttending ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
              {isAttending ? 'Cancelar Inscrição' : 'Inscrever-se'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sobre o Evento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Local e Acesso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {event.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.remote_link && (
                <div className="flex items-center gap-3">
                  <Video className="w-5 h-5 text-gray-500" />
                  <a 
                    href={event.remote_link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Link de acesso remoto
                  </a>
                </div>
              )}
              {event.max_attendees && (
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-500" />
                  <span>Máximo de {event.max_attendees} participantes</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participantes ({attendees.length}{event.max_attendees ? `/${event.max_attendees}` : ''})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {attendees.map(attendee => (
                  <div key={attendee.id} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={attendee.avatarUrl} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{attendee.name}</span>
                  </div>
                ))}
                {event.max_attendees && attendees.length < event.max_attendees && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 text-gray-500">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      +
                    </div>
                    <span className="text-sm">{event.max_attendees - attendees.length} vagas</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organizador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={creator.avatarUrl} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{creator.name}</p>
                  <p className="text-sm text-gray-500">{creator.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card>
              <CardHeader>
                <CardTitle>Administração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full">Editar Evento</Button>
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700">Excluir Evento</Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Compartilhar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">Copiar Link</Button>
              <Button variant="outline" className="w-full">Compartilhar no LinkedIn</Button>
              <Button variant="outline" className="w-full">Compartilhar no Twitter</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}