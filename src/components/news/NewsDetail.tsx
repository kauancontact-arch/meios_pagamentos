import { News } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Clock, Eye, Heart, Share2, Bookmark } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface NewsDetailProps {
  news: News;
  author?: any;
  onBack: () => void;
}

const categoryLabels = {
  regulatory: 'Regulamentação',
  industry: 'Indústria',
  technology: 'Tecnologia',
  market: 'Mercado',
  company: 'Empresa'
};

export function NewsDetail({ news, author, onBack }: NewsDetailProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {categoryLabels[news.category]}
          </Badge>
          {news.featured && (
            <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600">
              Destaque
            </Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-800 leading-tight">{news.title}</h1>

        <p className="text-xl text-gray-600">{news.summary}</p>

        {/* Article Meta */}
        <div className="flex items-center justify-between py-4 border-y">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={author?.avatarUrl} />
                <AvatarFallback>{author?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{author?.name || 'Autor'}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(news.publishedAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{news.readTime} min de leitura</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{news.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{news.likes}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Image */}
      {news.imageUrl && (
        <div className="rounded-lg overflow-hidden">
          <img
            src={news.imageUrl}
            alt={news.title}
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      {/* Article Content */}
      <Card>
        <CardContent className="p-8">
          <div className="prose prose-lg max-w-none">
            {news.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {news.tags.map(tag => (
              <Badge key={tag} variant="outline">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Curtir ({news.likes})
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
              <Button variant="outline" size="sm">
                <Bookmark className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              Artigo publicado em {format(new Date(news.publishedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}