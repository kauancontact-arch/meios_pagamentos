import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';
import { EventForm } from '@/components/events/EventForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Calendar, Search, Filter, Grid, List, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

type ViewMode = 'grid' | 'list' | 'calendar';
type FilterType = 'all' | 'upcoming' | 'past' | 'attending';
type SortBy = 'date' | 'title' | 'type';

export function EventsPage() {
  const { currentUser, navigate } = useAppContext();
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Mock states for enhanced functionality
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [attendingEvents] = useState(new Set(['event-1', 'event-3'])); // Mock attending events

  const isAdmin = currentUser?.roles?.includes('admin');

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      // Search filter
      if (searchTerm && !event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !event.description?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Type filter
      if (selectedType !== 'all' && event.type !== selectedType) {
        return false;
      }

      // Time filter
      const now = new Date();
      const eventDate = new Date(event.start_date);

      switch (filterType) {
        case 'upcoming':
          return isAfter(eventDate, now);
        case 'past':
          return isBefore(eventDate, now);
        case 'attending':
          return attendingEvents.has(event.id);
        default:
          return true;
      }
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'date':
        default:
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      }
    });

    return filtered;
  }, [events, searchTerm, filterType, selectedType, sortBy, attendingEvents]);

  const handleCreateEvent = async (eventData: any) => {
    setFormLoading(true);
    try {
      await createEvent({ ...eventData, created_by: currentUser!.id });
      setShowForm(false);
      toast.success('Evento criado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao criar evento: ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateEvent = async (eventData: any) => {
    if (!editingEvent) return;
    setFormLoading(true);
    try {
      await updateEvent(editingEvent.id, eventData);
      setEditingEvent(null);
      toast.success('Evento atualizado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao atualizar evento: ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return;
    try {
      await deleteEvent(eventId);
      toast.success('Evento excluído com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao excluir evento: ' + error.message);
    }
  };

  const handleEventClick = (eventId: string) => {
    navigate('eventDetail', { eventId });
  };

  if (showForm || editingEvent) {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => { setShowForm(false); setEditingEvent(null); }} className="mb-4">
            ← Voltar para Eventos
          </Button>
          <h1 className="text-3xl font-bold text-gray-800">
            {editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}
          </h1>
        </div>
        <EventForm
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
          onCancel={() => { setShowForm(false); setEditingEvent(null); }}
          loading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Eventos</h1>
          <p className="text-gray-500">Participe de reuniões, palestras, workshops e muito mais.</p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Criar Evento
          </Button>
        )}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar eventos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="upcoming">Próximos</SelectItem>
                  <SelectItem value="past">Passados</SelectItem>
                  <SelectItem value="attending">Participando</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="remote_meeting">Reunião Remota</SelectItem>
                  <SelectItem value="in_person">Presencial</SelectItem>
                  <SelectItem value="lecture">Palestra</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="conference">Conferência</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Por data</SelectItem>
                  <SelectItem value="title">Por título</SelectItem>
                  <SelectItem value="type">Por tipo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                <CalendarIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedEvents.length} evento{filteredAndSortedEvents.length !== 1 ? 's' : ''} encontrado{filteredAndSortedEvents.length !== 1 ? 's' : ''}
        </p>
        {(searchTerm || filterType !== 'all' || selectedType !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
              setSelectedType('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Events Display */}
      {loading ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Carregando eventos...</p>
        </div>
      ) : filteredAndSortedEvents.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => handleEventClick(event.id)}
                isAdmin={isAdmin}
                onEdit={() => setEditingEvent(event)}
                onDelete={() => handleDeleteEvent(event.id)}
              />
            ))}
          </div>
        ) : viewMode === 'list' ? (
          <Card>
            <CardContent className="p-0">
              {filteredAndSortedEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={`p-4 border-b cursor-pointer hover:bg-accent ${index === 0 ? 'border-t-0' : ''}`}
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">{event.title}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {event.type.replace('_', ' ')}
                        </Badge>
                        {attendingEvents.has(event.id) && (
                          <Badge variant="default" className="text-xs bg-green-600">
                            Participando
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{format(new Date(event.start_date), 'dd/MM/yyyy HH:mm')}</span>
                        {event.location && <span>{event.location}</span>}
                        {event.max_attendees && <span>Máx: {event.max_attendees}</span>}
                      </div>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 ml-4">
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setEditingEvent(event); }}>
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}>
                          Excluir
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          // Calendar view mock
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <CalendarIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Visualização de Calendário</h3>
                <p className="text-gray-500 mb-4">Em breve: Visualize todos os eventos em um calendário interativo.</p>
                <div className="grid grid-cols-7 gap-2 max-w-md mx-auto">
                  {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: 35 }, (_, i) => (
                    <div
                      key={i}
                      className={`text-center py-2 text-sm border rounded ${
                        i === 15 ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                      }`}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
          <p className="text-gray-500 mb-4">Tente ajustar os filtros ou criar um novo evento.</p>
          {isAdmin && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          )}
        </div>
      )}
    </div>
  );
}