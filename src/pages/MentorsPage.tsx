import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { mockMentors } from '@/mocks/mentors';
import { mockMentorshipRequests } from '@/mocks/mentorshipRequests';
import { MentorCard } from '@/components/mentors/MentorCard';
import { MentorDetail } from '@/components/mentors/MentorDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, Filter, Users, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

type SortBy = 'rating' | 'hourlyRate' | 'experience' | 'name';

export function MentorsPage() {
  const { currentUser, navigate } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('rating');
  const [selectedMentor, setSelectedMentor] = useState<any>(null);

  // Get all unique specialties
  const allSpecialties = Array.from(
    new Set(mockMentors.flatMap(mentor => mentor.specialties))
  ).sort();

  // Filter and sort mentors
  const filteredAndSortedMentors = useMemo(() => {
    let filtered = mockMentors.filter(mentor => {
      // Search filter
      const fullName = [mentor.user.first_name, mentor.user.last_name].filter(Boolean).join(' ').toLowerCase();
      if (searchTerm && !fullName.includes(searchTerm.toLowerCase()) &&
          !mentor.user.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }

      // Specialty filter
      if (selectedSpecialty !== 'all' && !mentor.specialties.includes(selectedSpecialty)) {
        return false;
      }

      // Availability filter
      if (selectedAvailability !== 'all' && mentor.availability !== selectedAvailability) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'hourlyRate':
          return a.hourlyRate - b.hourlyRate;
        case 'experience':
          return b.experience.localeCompare(a.experience);
        case 'name':
          const nameA = [a.user.first_name, a.user.last_name].filter(Boolean).join(' ');
          const nameB = [b.user.first_name, b.user.last_name].filter(Boolean).join(' ');
          return nameA.localeCompare(nameB);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockMentors, searchTerm, selectedSpecialty, selectedAvailability, sortBy]);

  // Check if user has pending request with mentor
  const hasPendingRequest = (mentorId: string) => {
    return mockMentorshipRequests.some(
      request => request.mentorId === mentorId &&
                 request.menteeId === currentUser?.id &&
                 request.status === 'pending'
    );
  };

  const handleRequestMentorship = (mentorId: string, requestData: any) => {
    // Mock request creation
    toast.success('Solicitação de mentoria enviada com sucesso!');
    console.log('Mentorship request:', { mentorId, ...requestData });
  };

  if (selectedMentor) {
    return (
      <div className="space-y-6">
        <div>
          <Button variant="ghost" onClick={() => setSelectedMentor(null)} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para mentores
          </Button>
        </div>
        <MentorDetail
          mentor={selectedMentor}
          onRequestMentorship={(requestData) => handleRequestMentorship(selectedMentor.id, requestData)}
          hasPendingRequest={hasPendingRequest(selectedMentor.id)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Mentores</h1>
        <p className="text-gray-500">Encontre mentores especializados em pagamentos e solicite orientação personalizada.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockMentors.length}</p>
                <p className="text-sm text-gray-500">Mentores disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {(mockMentors.reduce((acc, m) => acc + m.rating, 0) / mockMentors.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">Avaliação média</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Filter className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{allSpecialties.length}</p>
                <p className="text-sm text-gray-500">Especialidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nome, título ou especialidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Todas as especialidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as especialidades</SelectItem>
                  {allSpecialties.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Disponibilidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="available">Disponíveis</SelectItem>
                  <SelectItem value="busy">Ocupados</SelectItem>
                  <SelectItem value="unavailable">Indisponíveis</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Por avaliação</SelectItem>
                  <SelectItem value="hourlyRate">Por preço</SelectItem>
                  <SelectItem value="experience">Por experiência</SelectItem>
                  <SelectItem value="name">Por nome</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedMentors.length} mentor{filteredAndSortedMentors.length !== 1 ? 'es' : ''} encontrado{filteredAndSortedMentors.length !== 1 ? 's' : ''}
        </p>
        {(searchTerm || selectedSpecialty !== 'all' || selectedAvailability !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('all');
              setSelectedAvailability('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Mentors Grid */}
      {filteredAndSortedMentors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedMentors.map(mentor => (
            <MentorCard
              key={mentor.id}
              mentor={mentor}
              onClick={() => setSelectedMentor(mentor)}
              onRequestMentorship={() => {
                if (hasPendingRequest(mentor.id)) {
                  toast.error('Você já tem uma solicitação pendente com este mentor.');
                } else {
                  setSelectedMentor(mentor);
                }
              }}
              hasPendingRequest={hasPendingRequest(mentor.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum mentor encontrado</h3>
          <p className="text-gray-500 mb-4">Tente ajustar os filtros ou termos de busca.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedSpecialty('all');
              setSelectedAvailability('all');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}