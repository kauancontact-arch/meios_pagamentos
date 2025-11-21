import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { mockNews } from '@/mocks/news';
import { mockUsers } from '@/mocks/users';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsDetail } from '@/components/news/NewsDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Filter, Newspaper, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

type SortBy = 'recent' | 'popular' | 'featured';

export function NewsPage() {
  const { currentUser } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [selectedNews, setSelectedNews] = useState<any>(null);
  const [newsletterEmail, setNewsletterEmail] = useState(currentUser?.email || '');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const categories = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'regulatory', label: 'Regulamentação' },
    { value: 'industry', label: 'Indústria' },
    { value: 'technology', label: 'Tecnologia' },
    { value: 'market', label: 'Mercado' },
    { value: 'company', label: 'Empresa' }
  ];

  // Filter and sort news
  const filteredAndSortedNews = useMemo(() => {
    let filtered = mockNews.filter(news => {
      // Search filter
      if (searchTerm && !news.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !news.summary.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !news.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && news.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'popular':
          return b.views - a.views;
        case 'featured':
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockNews, searchTerm, selectedCategory, sortBy]);

  const handleSubscribeNewsletter = async () => {
    if (!newsletterEmail.trim()) {
      toast.error('Por favor, insira um email válido');
      return;
    }

    // Mock subscription
    setIsSubscribed(true);
    toast.success('Inscrição realizada com sucesso! Você receberá as últimas notícias diariamente.');
  };

  if (selectedNews) {
    const author = mockUsers.find(u => u.id === selectedNews.authorId);
    return (
      <NewsDetail
        news={selectedNews}
        author={author}
        onBack={() => setSelectedNews(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Notícias</h1>
        <p className="text-gray-500">Fique por dentro das últimas novidades do mercado de pagamentos.</p>
      </div>

      {/* Newsletter Subscription */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Newsletter Diário
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isSubscribed ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span>Inscrito com sucesso! Você receberá as notícias diariamente.</span>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Seu melhor email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                type="email"
                className="flex-1"
              />
              <Button onClick={handleSubscribeNewsletter}>
                Inscrever-se
              </Button>
            </div>
          )}
          <p className="text-sm text-gray-600 mt-2">
            Receba diariamente as principais notícias do setor de pagamentos diretamente no seu email.
          </p>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Newspaper className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockNews.length}</p>
                <p className="text-sm text-gray-500">Notícias publicadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">2.5K</p>
                <p className="text-sm text-gray-500">Assinantes da newsletter</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{mockNews.filter(n => n.featured).length}</p>
                <p className="text-sm text-gray-500">Notícias em destaque</p>
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
                placeholder="Buscar notícias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Mais recentes</SelectItem>
                  <SelectItem value="popular">Mais populares</SelectItem>
                  <SelectItem value="featured">Em destaque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedNews.length} notícia{filteredAndSortedNews.length !== 1 ? 's' : ''} encontrada{filteredAndSortedNews.length !== 1 ? 's' : ''}
        </p>
        {(searchTerm || selectedCategory !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Featured News */}
      {filteredAndSortedNews.filter(news => news.featured).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Em Destaque</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAndSortedNews
              .filter(news => news.featured)
              .slice(0, 2)
              .map(news => {
                const author = mockUsers.find(u => u.id === news.authorId);
                return (
                  <NewsCard
                    key={news.id}
                    news={news}
                    author={author}
                    onClick={() => setSelectedNews(news)}
                  />
                );
              })}
          </div>
        </div>
      )}

      {/* All News */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Todas as Notícias</h2>
        {filteredAndSortedNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedNews.map(news => {
              const author = mockUsers.find(u => u.id === news.authorId);
              return (
                <NewsCard
                  key={news.id}
                  news={news}
                  author={author}
                  onClick={() => setSelectedNews(news)}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Newspaper className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma notícia encontrada</h3>
            <p className="text-gray-500 mb-4">Tente ajustar os filtros ou termos de busca.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}