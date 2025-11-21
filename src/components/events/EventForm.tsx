import { useState } from 'react';
import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Users, Video, Globe } from 'lucide-react';

interface EventFormProps {
  event?: Event;
  onSubmit: (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

const eventTypes = [
  { value: 'remote_meeting', label: 'Reunião Remota', icon: <Video className="w-4 h-4" /> },
  { value: 'in_person', label: 'Presencial', icon: <MapPin className="w-4 h-4" /> },
  { value: 'lecture', label: 'Palestra', icon: <Globe className="w-4 h-4" /> },
  { value: 'workshop', label: 'Workshop', icon: <Users className="w-4 h-4" /> },
  { value: 'conference', label: 'Conferência', icon: <Globe className="w-4 h-4" /> },
];

export function EventForm({ event, onSubmit, onCancel, loading }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    type: event?.type || 'remote_meeting',
    start_date: event?.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
    end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
    location: event?.location || '',
    remote_link: event?.remote_link || '',
    max_attendees: event?.max_attendees?.toString() || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type as Event['type'],
      start_date: new Date(formData.start_date).toISOString(),
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : undefined,
      location: formData.location || undefined,
      remote_link: formData.remote_link || undefined,
      max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
      created_by: '', // Will be set by the hook
    };

    await onSubmit(eventData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{event ? 'Editar Evento' : 'Criar Novo Evento'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo de Evento *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      {type.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Data e Hora de Início *</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">Data e Hora de Fim</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Ex: São Paulo, SP ou Online"
            />
          </div>

          <div>
            <Label htmlFor="remote_link">Link Remoto</Label>
            <Input
              id="remote_link"
              type="url"
              value={formData.remote_link}
              onChange={(e) => setFormData(prev => ({ ...prev, remote_link: e.target.value }))}
              placeholder="https://meet.google.com/..."
            />
          </div>

          <div>
            <Label htmlFor="max_attendees">Máximo de Participantes</Label>
            <Input
              id="max_attendees"
              type="number"
              value={formData.max_attendees}
              onChange={(e) => setFormData(prev => ({ ...prev, max_attendees: e.target.value }))}
              placeholder="Ex: 50"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : event ? 'Atualizar' : 'Criar'} Evento
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}