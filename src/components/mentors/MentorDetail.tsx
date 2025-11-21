import { Mentor, MentorshipRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Clock, MessageCircle, MapPin, DollarSign, Award, Globe, Users } from 'lucide-react';
import { useState } from 'react';

interface MentorDetailProps {
  mentor: Mentor;
  onRequestMentorship: (request: Omit<MentorshipRequest, 'id' | 'mentorId' | 'menteeId' | 'status' | 'requestedAt'>) => void;
  hasPendingRequest?: boolean;
}

export function MentorDetail({ mentor, onRequestMentorship, hasPendingRequest }: MentorDetailProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    message: '',
    proposedDate: '',
    duration: 60,
  });

  const fullName = [mentor.user.first_name, mentor.user.last_name].filter(Boolean).join(' ') || 'Mentor';

  const handleSubmitRequest = () => {
    if (!requestData.message.trim()) return;

    onRequestMentorship({
      message: requestData.message,
      proposedDate: requestData.proposedDate || undefined,
      duration: requestData.duration,
    });

    setShowRequestForm(false);
    setRequestData({ message: '', proposedDate: '', duration: 60 });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarImage src={mentor.user.avatar_url} alt={fullName} />
              <AvatarFallback className="text-3xl">{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{fullName}</h1>
              <p className="text-xl text-primary font-medium">{mentor.user.title}</p>
              <p className="text-gray-600">{mentor.user.company}</p>

              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mentor.rating}</span>
                  <span className="text-gray-500">({mentor.totalReviews} avaliações)</span>
                </div>
                <Badge variant="secondary" className="text-sm">
                  {mentor.experience} de experiência
                </Badge>
                <Badge variant="outline" className="text-sm">
                  R$ {mentor.hourlyRate}/hora
                </Badge>
              </div>

              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{mentor.mentorshipCount} mentorias realizadas</span>
                </div>
                {mentor.user.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{mentor.user.location}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="md:text-right">
              <Button
                onClick={() => setShowRequestForm(true)}
                disabled={mentor.availability === 'unavailable' || hasPendingRequest}
                variant={hasPendingRequest ? "secondary" : "default"}
                size="lg"
              >
                {hasPendingRequest ? 'Solicitação Pendente' : 'Solicitar Mentoria'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio */}
          <Card>
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{mentor.bio}</p>
            </CardContent>
          </Card>

          {/* Specialties */}
          <Card>
            <CardHeader>
              <CardTitle>Especialidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mentor.specialties.map(specialty => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Conquistas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mentor.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary mt-0.5" />
                    <span className="text-gray-700">{achievement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Idiomas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mentor.languages.map(language => (
                  <Badge key={language} variant="outline">
                    {language}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge
                variant="secondary"
                className={`w-full justify-center py-2 ${
                  mentor.availability === 'available'
                    ? 'bg-green-100 text-green-800'
                    : mentor.availability === 'busy'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {mentor.availability === 'available'
                  ? 'Disponível para mentorias'
                  : mentor.availability === 'busy'
                  ? 'Ocupado no momento'
                  : 'Indisponível temporariamente'
                }
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <Card className="fixed inset-0 z-50 m-auto max-w-md h-fit">
          <CardHeader>
            <CardTitle>Solicitar Mentoria</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="message">Mensagem *</Label>
              <Textarea
                id="message"
                placeholder="Conte ao mentor sobre seus objetivos e o que você espera da mentoria..."
                value={requestData.message}
                onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="proposedDate">Data sugerida (opcional)</Label>
              <Input
                id="proposedDate"
                type="datetime-local"
                value={requestData.proposedDate}
                onChange={(e) => setRequestData(prev => ({ ...prev, proposedDate: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="duration">Duração sugerida (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={requestData.duration}
                onChange={(e) => setRequestData(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                min={30}
                max={180}
                step={30}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmitRequest} className="flex-1">
                Enviar Solicitação
              </Button>
              <Button variant="outline" onClick={() => setShowRequestForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overlay for modal */}
      {showRequestForm && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setShowRequestForm(false)}
        />
      )}
    </div>
  );
}