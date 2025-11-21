import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { mockCourses, getBasicCourses, getIntermediateCourses, getAdvancedCourses } from '@/mocks/courses';
import { CourseCard } from '@/components/courses/CourseCard';
import { CourseDetail } from '@/components/courses/CourseDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Filter, BookOpen, Star, Users, Clock, Award } from 'lucide-react';
import { toast } from 'react-hot-toast';

type SortBy = 'rating' | 'students' | 'duration' | 'price' | 'recent';

export function TracksPage() {
  const { currentUser, navigate } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('rating');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const topics = [
    { value: 'all', label: 'Todos os tópicos' },
    { value: 'autorização', label: 'Autorização de Cartão' },
    { value: 'iso', label: 'ISO 8583' },
    { value: 'clearing', label: 'Clearing' },
    { value: 'antecipação', label: 'Antecipação' },
    { value: 'agenda', label: 'Agenda' },
    { value: 'registradora', label: 'Registradora' },
    { value: 'liquidação', label: 'Liquidação' },
    { value: 'conciliação', label: 'Conciliação' }
  ];

  const levels = [
    { value: 'all', label: 'Todos os níveis' },
    { value: 'basic', label: 'Básico' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' }
  ];

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = mockCourses.filter(course => {
      // Search filter
      if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !course.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all' && course.level !== selectedLevel) {
        return false;
      }

      // Topic filter
      if (selectedTopic !== 'all') {
        const topicKeywords = {
          'autorização': ['autorização', 'cartão'],
          'iso': ['iso8583', 'mensagens'],
          'clearing': ['clearing'],
          'antecipação': ['antecipação', 'recebíveis'],
          'agenda': ['agenda', 'pagamentos'],
          'registradora': ['registradora', 'POS'],
          'liquidação': ['liquidação', 'settlement'],
          'conciliação': ['conciliação', 'reconciliation']
        };

        const keywords = topicKeywords[selectedTopic as keyof typeof topicKeywords] || [];
        const matchesTopic = keywords.some(keyword =>
          course.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
          course.title.toLowerCase().includes(keyword) ||
          course.description.toLowerCase().includes(keyword)
        );

        if (!matchesTopic) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'students':
          return b.studentsCount - a.studentsCount;
        case 'duration':
          return a.duration - b.duration;
        case 'price':
          return a.price - b.price;
        case 'recent':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockCourses, searchTerm, selectedLevel, selectedTopic, sortBy]);

  const handleEnrollCourse = (course: any) => {
    if (course.price > 0 && !currentUser?.roles?.includes('premium')) {
      toast.error('Este curso requer assinatura premium');
      return;
    }

    toast.success(`Inscrito no curso: ${course.title}!`);
    // Mock enrollment logic
    console.log('Enrolled in course:', course.title);
  };

  if (selectedCourse) {
    return (
      <CourseDetail
        course={selectedCourse}
        onBack={() => setSelectedCourse(null)}
        onEnroll={() => handleEnrollCourse(selectedCourse)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Trilhas de Aprendizado</h1>
        <p className="text-gray-500">Cursos estruturados sobre pagamentos digitais, do básico ao avançado.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockCourses.length}</p>
                <p className="text-sm text-gray-500">Cursos disponíveis</p>
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
                  {(mockCourses.reduce((acc, c) => acc + c.rating, 0) / mockCourses.length).toFixed(1)}
                </p>
                <p className="text-sm text-gray-500">Avaliação média</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {mockCourses.reduce((acc, c) => acc + c.studentsCount, 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Alunos matriculados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {mockCourses.filter(c => c.price === 0).length}
                </p>
                <p className="text-sm text-gray-500">Cursos gratuitos</p>
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
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Nível" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(level => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Tópico" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map(topic => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Por avaliação</SelectItem>
                  <SelectItem value="students">Por alunos</SelectItem>
                  <SelectItem value="duration">Por duração</SelectItem>
                  <SelectItem value="price">Por preço</SelectItem>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedCourses.length} curso{filteredAndSortedCourses.length !== 1 ? 's' : ''} encontrado{filteredAndSortedCourses.length !== 1 ? 's' : ''}
        </p>
        {(searchTerm || selectedLevel !== 'all' || selectedTopic !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('all');
              setSelectedTopic('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Courses by Level */}
      {selectedLevel === 'all' && !searchTerm && selectedTopic === 'all' ? (
        <div className="space-y-8">
          {/* Basic Level */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Básico
              </Badge>
              <span className="text-sm text-gray-600">
                {getBasicCourses().length} cursos • Perfeito para começar
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getBasicCourses().slice(0, 6).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => setSelectedCourse(course)}
                  onEnroll={() => handleEnrollCourse(course)}
                />
              ))}
            </div>
          </div>

          {/* Intermediate Level */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Intermediário
              </Badge>
              <span className="text-sm text-gray-600">
                {getIntermediateCourses().length} cursos • Para quem já tem experiência
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getIntermediateCourses().slice(0, 6).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => setSelectedCourse(course)}
                  onEnroll={() => handleEnrollCourse(course)}
                />
              ))}
            </div>
          </div>

          {/* Advanced Level */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Avançado
              </Badge>
              <span className="text-sm text-gray-600">
                {getAdvancedCourses().length} cursos • Para especialistas
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getAdvancedCourses().slice(0, 6).map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => setSelectedCourse(course)}
                  onEnroll={() => handleEnrollCourse(course)}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Filtered Results */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourses.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => setSelectedCourse(course)}
              onEnroll={() => handleEnrollCourse(course)}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedCourses.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum curso encontrado</h3>
          <p className="text-gray-500 mb-4">Tente ajustar os filtros ou termos de busca.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedLevel('all');
              setSelectedTopic('all');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}