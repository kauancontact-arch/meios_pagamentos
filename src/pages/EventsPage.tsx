import { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useEvents } from '@/hooks/useEvents';
import { EventCard } from '@/components/events/EventCard';
import { EventForm } from '@/components/events/EventForm';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function EventsPage() {
  const { currentUser } = useAppContext();
  const { events, loading, createEvent, updateEvent, deleteEvent } = useEvents();
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formLoading, setFormLoading] = useState(false);

  const isAdmin = currentUser?.roles?.includes('admin');

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
    <div className="space-y-8">
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

      {loading ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Carregando eventos...</p>
        </div>
      ) : events.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onClick={() => {/* TODO: Navigate to event detail */}}
              isAdmin={isAdmin}
              onEdit={() => setEditingEvent(event)}
              onDelete={() => handleDeleteEvent(event.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum evento encontrado</h3>
          <p className="text-gray-500 mb-4">Seja o primeiro a criar um evento!</p>
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