import { motion } from 'framer-motion';
import { News } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Eye, Heart, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NewsCardProps {
  news: News;
  author?: any;
  onClick: () => void;
}

const categoryLabels = {
  regulatory: 'Regulamentação',
  industry: 'Indústria',
  technology: 'Tecnologia',
  market: 'Mercado',
  company: 'Empresa'
};

const categoryColors = {
  regulatory: 'bg-blue-100 text-blue-800',
  industry: 'bg-green-100 text-green-800',
  technology: 'bg-purple-100 text-purple-800',
  market: 'bg-orange-100 text-orange-800',
  company: 'bg-red-100 text-red-800'
};

export function NewsCard({ news, author, onClick }: NewsCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="h-full">
      <Card className="h-full flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow cursor-pointer" onClick={onClick}>
        {news.imageUrl && (
          <div className="relative">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            {news.featured && (
              <Badge className="absolute top-3 left-3 bg-yellow-500 hover:bg-yellow-600">
                <Star className="w-3 h-3 mr-1" />
                Destaque
              </Badge>
            )}
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between mb-2">
            <Badge variant="secondary" className={categoryColors[news.category]}>
              {categoryLabels[news.category]}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>{news.readTime} min</span>
            </div>
          </div>
          <CardTitle className="text-lg line-clamp-2">{news.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">{news.summary}</p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{news.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{news.likes}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-3">
            {news.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <div className="p-4 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={author?.avatarUrl} />
              <AvatarFallback className="text-xs">{author?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{author?.name || 'Autor'}</span>
          </div>
          <span className="text-xs text-gray-500">
            {format(new Date(news.publishedAt), 'dd/MM', { locale: ptBR })}
          </span>
        </div>
      </Card>
    </motion.div>
  );
}