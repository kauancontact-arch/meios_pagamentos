import { Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Clock, Users, Star, Award, BookOpen, CheckCircle, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CourseDetailProps {
  course: Course;
  onBack: () => void;
  onEnroll: () => void;
}

const levelLabels = {
  basic: 'Básico',
  intermediate: 'Intermediário',
  advanced: 'Avançado'
};

const levelDescriptions = {
  basic: 'Perfeito para quem está começando no assunto',
  intermediate: 'Para quem já tem experiência básica',
  advanced: 'Para especialistas e profissionais experientes'
};

const moduleIcons = {
  video: <PlayCircle className="w-5 h-5 text-blue-500" />,
  text: <FileText className="w-5 h-5 text-green-500" />,
  quiz: <HelpCircle className="w-5 h-5 text-purple-500" />,
};

export function CourseDetail({ course, onBack, onEnroll }: CourseDetailProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito';
    return `R$ ${price.toFixed(2)}`;
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
    }
    return `${mins}min`;
  };

  // Mock progress for enrolled users
  const isEnrolled = false; // This would come from user data
  const progress = 0; // Mock progress

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para cursos
        </Button>
      </div>

      {/* Course Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {levelLabels[course.level]}
                </Badge>
                <span className="text-sm text-gray-600">{levelDescriptions[course.level]}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
              <p className="text-lg text-gray-600 mb-4">{course.description}</p>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                  <span>({course.studentsCount} alunos)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.modules.length} módulos</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{course.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">por {course.instructor}</span>
              </div>
            </div>

            <div className="lg:text-right">
              <div className="text-3xl font-bold text-primary mb-2">
                {formatPrice(course.price)}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                {course.completionRate}% dos alunos concluem
              </div>
              <Button onClick={onEnroll} size="lg" className="w-full lg:w-auto">
                {course.price === 0 ? 'Inscrever-se Gratuitamente' : 'Comprar Agora'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar for Enrolled Users */}
      {isEnrolled && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Seu Progresso</span>
              <span className="text-sm font-bold text-primary">{progress}%</span>
            </div>
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-gray-500">Continue assistindo para completar o curso</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Content */}
          <Card>
            <CardHeader>
              <CardTitle>Conteúdo do Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {course.modules.map((module, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      {index + 1}
                    </div>
                    <span className="flex-1 text-gray-700">{module}</span>
                    {isEnrolled && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prerequisites */}
          {course.prerequisites.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pré-requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.prerequisites.map(prereq => (
                    <Badge key={prereq} variant="outline">
                      {prereq}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tópicos Abordados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {course.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Alunos matriculados</span>
                <span className="font-medium">{course.studentsCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avaliação</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{course.rating}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Taxa de conclusão</span>
                <span className="font-medium">{course.completionRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Última atualização</span>
                <span className="font-medium text-sm">
                  {format(new Date(course.lastUpdated), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Instructor Info */}
          <Card>
            <CardHeader>
              <CardTitle>Instrutor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-lg">{course.instructor.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{course.instructor}</p>
                  <p className="text-sm text-gray-600">Especialista em Pagamentos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                Certificado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Ao completar este curso, você receberá um certificado de conclusão.
              </p>
              <Badge variant="outline" className="text-xs">
                Certificado incluído
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}