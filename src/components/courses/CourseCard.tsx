import { motion } from 'framer-motion';
import { Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users, Award, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
  onEnroll?: () => void;
}

const levelLabels = {
  basic: 'Básico',
  intermediate: 'Intermediário',
  advanced: 'Avançado'
};

const levelColors = {
  basic: 'bg-green-100 text-green-800',
  intermediate: 'bg-blue-100 text-blue-800',
  advanced: 'bg-purple-100 text-purple-800'
};

export function CourseCard({ course, onClick, onEnroll }: CourseCardProps) {
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

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={onClick}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className={levelColors[course.level]}>
              {levelLabels[course.level]}
            </Badge>
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(course.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 ml-1">{course.rating}</span>
            </div>
          </div>
          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{course.description}</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.studentsCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4 text-gray-500" />
                <span>{course.modules.length} módulos</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4 text-green-500" />
                <span>{course.completionRate}% concluem</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {course.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {course.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{course.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        <div className="p-4 bg-gray-50/50 flex items-center justify-between">
          <div className="font-bold text-lg text-primary">
            {formatPrice(course.price)}
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onEnroll?.();
            }}
            size="sm"
            variant={course.price === 0 ? 'default' : 'outline'}
          >
            {course.price === 0 ? 'Inscrever-se' : 'Ver Detalhes'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}