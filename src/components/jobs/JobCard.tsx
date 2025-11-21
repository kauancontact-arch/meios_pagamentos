import { motion } from 'framer-motion';
import { Job } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onApply?: () => void;
}

const typeLabels = {
  'full-time': 'Tempo Integral',
  'part-time': 'Meio Período',
  'contract': 'Contrato',
  'freelance': 'Freelance',
  'internship': 'Estágio'
};

const experienceLabels = {
  entry: 'Júnior',
  mid: 'Pleno',
  senior: 'Sênior',
  lead: 'Líder',
  executive: 'Executivo'
};

const typeColors = {
  'full-time': 'bg-blue-100 text-blue-800',
  'part-time': 'bg-green-100 text-green-800',
  'contract': 'bg-orange-100 text-orange-800',
  'freelance': 'bg-purple-100 text-purple-800',
  'internship': 'bg-yellow-100 text-yellow-800'
};

export function JobCard({ job, onClick, onApply }: JobCardProps) {
  const formatSalary = (salary: Job['salary']) => {
    if (!salary) return 'A combinar';
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: salary.currency,
    });
    if (salary.min === salary.max) {
      return formatter.format(salary.min);
    }
    return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={onClick}>
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <div className="flex gap-1">
              <Badge variant="secondary" className={typeColors[job.type]}>
                {typeLabels[job.type]}
              </Badge>
              <Badge variant="outline">
                {experienceLabels[job.experience]}
              </Badge>
            </div>
            {job.isRemote && (
              <Badge variant="default" className="bg-green-600">
                Remoto
              </Badge>
            )}
          </div>
          <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
          <p className="text-primary font-medium">{job.company}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary(job.salary)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Publicado {format(new Date(job.postedAt), 'dd/MM', { locale: ptBR })}</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>

          <div className="flex flex-wrap gap-1 mb-4">
            {job.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {job.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{job.tags.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{job.applications} candidatos</span>
            </div>
            <span>{job.views} visualizações</span>
          </div>
        </CardContent>
        <div className="p-4 bg-gray-50/50">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onApply?.();
            }}
            className="w-full"
            asChild
          >
            <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Candidatar-se
            </a>
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}