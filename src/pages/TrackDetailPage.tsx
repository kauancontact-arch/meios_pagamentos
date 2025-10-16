import { useAppContext } from '@/contexts/AppContext';
import { mockTracks } from '@/mocks/tracks';
import { mockModules } from '@/mocks/modules';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Circle, FileText, PlayCircle, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Lesson } from '@/types';

const lessonIcons = {
  video: <PlayCircle className="w-5 h-5 text-blue-500" />,
  text: <FileText className="w-5 h-5 text-green-500" />,
  quiz: <HelpCircle className="w-5 h-5 text-purple-500" />,
};

const LessonItem = ({ lesson, isCompleted }: { lesson: Lesson, isCompleted: boolean }) => (
  <div className="flex items-center justify-between p-3 rounded-md hover:bg-accent">
    <div className="flex items-center gap-3">
      {lessonIcons[lesson.type]}
      <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-xs text-gray-500">{lesson.durationMinutes} min</span>
      {isCompleted ? (
        <CheckCircle className="w-5 h-5 text-primary" />
      ) : (
        <Circle className="w-5 h-5 text-gray-300" />
      )}
    </div>
  </div>
);

export function TrackDetailPage() {
  const { screenParams, navigate } = useAppContext();
  const { trackId } = screenParams;

  const track = mockTracks.find(t => t.id === trackId);
  const modules = mockModules.filter(m => m.trackId === trackId);
  
  // Mock progress
  const completedLessons = 1;
  const totalLessons = modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const progress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  if (!track) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Trilha não encontrada</h1>
        <Button onClick={() => navigate('tracks')}>Voltar para as Trilhas</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" onClick={() => navigate('tracks')} className="mb-4 text-sm text-gray-600 px-1">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para todas as trilhas
        </Button>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center text-4xl">
            {track.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{track.title}</h1>
            <p className="text-gray-500 mt-1">{track.description}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Progresso</span>
            <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardContent>
      </Card>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-800">Módulos</h2>
        <Accordion type="single" collapsible defaultValue="mod-1-1" className="w-full">
          {modules.map(module => (
            <AccordionItem value={module.id} key={module.id}>
              <AccordionTrigger className="font-semibold text-base">{module.title}</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1">
                  {module.lessons.map((lesson, index) => (
                    <LessonItem key={lesson.id} lesson={lesson} isCompleted={index < completedLessons} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}