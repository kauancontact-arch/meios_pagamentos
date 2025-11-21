import { motion } from 'framer-motion';
import { Mentor } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Clock, MessageCircle, MapPin, DollarSign } from 'lucide-react';

interface MentorCardProps {
  mentor: Mentor;
  onClick: () => void;
  onRequestMentorship?: () => void;
  hasPendingRequest?: boolean;
}

const availabilityColors = {
  available: 'bg-green-100 text-green-800',
  busy: 'bg-yellow-100 text-yellow-800',
  unavailable: 'bg-red-100 text-red-800',
};

const availabilityLabels = {
  available: 'Disponível',
  busy: 'Ocupado',
  unavailable: 'Indisponível',
};

export function MentorCard({ mentor, onClick, onRequestMentorship, hasPendingRequest }: MentorCardProps) {
  const fullName = [mentor.user.first_name, mentor.user.last_name].filter(Boolean).join(' ') || 'Mentor';

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={onClick}>
        <CardHeader>
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarImage src={mentor.user.avatar_url} alt={fullName} />
              <AvatarFallback className="text-lg">{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{fullName}</CardTitle>
              <p className="text-sm text-gray-600">{mentor.user.title}</p>
              <p className="text-sm text-gray-500">{mentor.user.company}</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{mentor.rating}</span>
                  <span className="text-xs text-gray-500">({mentor.totalReviews})</span>
                </div>
                <Badge variant="secondary" className={`text-xs ${availabilityColors[mentor.availability]}`}>
                  {availabilityLabels[mentor.availability]}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{mentor.bio}</p>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Especialidades</h4>
              <div className="flex flex-wrap gap-1">
                {mentor.specialties.slice(0, 3).map(specialty => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
                {mentor.specialties.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{mentor.specialties.length - 3}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                <span>R$ {mentor.hourlyRate}/h</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{mentor.experience}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle className="w-4 h-4" />
                <span>{mentor.mentorshipCount}</span>
              </div>
            </div>

            {mentor.user.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{mentor.user.location}</span>
              </div>
            )}
          </div>
        </CardContent>
        <div className="p-4 bg-gray-50/50">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onRequestMentorship?.();
            }}
            className="w-full"
            disabled={mentor.availability === 'unavailable' || hasPendingRequest}
            variant={hasPendingRequest ? "secondary" : "default"}
          >
            {hasPendingRequest ? 'Solicitação Pendente' : 'Solicitar Mentoria'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}