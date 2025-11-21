import { useState, useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { mockTools } from '@/mocks/tools';
import { ToolCard } from '@/components/tools/ToolCard';
import { ToolDetail } from '@/components/tools/ToolDetail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Search, Filter, Wrench, Star, Users, Zap, Crown, TestTube } from 'lucide-react';
import { toast } from 'react-hot-toast';

type SortBy = 'popularity' | 'usage' | 'name' | 'newest';

export function ToolsPage() {
  const { currentUser, navigate } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortBy>('popularity');
  const [selectedTool, setSelectedTool] = useState<any>(null);

  const categories = [
    { value: 'all', label: 'Todas as categorias' },
    { value: 'iso8583', label: 'ISO 8583' },
    { value: 'conciliation', label: 'Conciliação' },
    { value: 'metrics', label: 'Métricas' },
    { value: 'settlement', label: 'Liquidação' },
    { value: 'ai', label: 'Inteligência Artificial' },
    { value: 'rules', label: 'Regras' },
    { value: 'other', label: 'Outros' }
  ];

  const statuses = [
    { value: 'all', label: 'Todos os status' },
    { value: 'free', label: 'Gratuito' },
    { value: 'premium', label: 'Premium' },
    { value: 'beta', label: 'Beta' }
  ];

  // Filter and sort tools
  const filteredAndSortedTools = useMemo(() => {
    let filtered = mockTools.filter(tool => {
      // Search filter
      if (searchTerm && !tool.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !tool.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !tool.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && tool.status !== selectedStatus) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'usage':
          return b.usageCount - a.usageCount;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          // Mock: assume newer tools have higher IDs
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return filtered;
  }, [mockTools, searchTerm, selectedCategory, selectedStatus, sortBy]);

  const handleTryNow = (tool: any) => {
    if (tool.status === 'premium' && !currentUser?.roles?.includes('premium')) {
      toast.error('Esta ferramenta requer assinatura premium');
      return;
    }

    if (tool.demoUrl) {
      window.open(tool.demoUrl, '_blank');
    } else {
      toast.success(`Abrindo ${tool.name}...`);
      // Mock: simulate opening tool
      console.log('Opening tool:', tool.name);
    }
  };

  if (selectedTool) {
    return (
      <ToolDetail
        tool={selectedTool}
        onTryNow={() => handleTryNow(selectedTool)}
        onBack={() => setSelectedTool(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Ferramentas</h1>
        <p className="text-gray-500">Ferramentas especializadas para profissionais de pagamentos.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Wrench className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{mockTools.length}</p>
                <p className="text-sm text-gray-500">Ferramentas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{mockTools.filter(t => t.status === 'free').length}</p>
                <p className="text-sm text-gray-500">Gratuitas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Crown className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{mockTools.filter(t => t.status === 'premium').length}</p>
                <p className="text-sm text-gray-500">Premium</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TestTube className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{mockTools.filter(t => t.status === 'beta').length}</p>
                <p className="text-sm text-gray-500">Beta</p>
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
                placeholder="Buscar ferramentas..."
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

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Por popularidade</SelectItem>
                  <SelectItem value="usage">Por uso</SelectItem>
                  <SelectItem value="name">Por nome</SelectItem>
                  <SelectItem value="newest">Mais recentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredAndSortedTools.length} ferramenta{filteredAndSortedTools.length !== 1 ? 's' : ''} encontrada{filteredAndSortedTools.length !== 1 ? 's' : ''}
        </p>
        {(searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Tools Grid */}
      {filteredAndSortedTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedTools.map(tool => (
            <ToolCard
              key={tool.id}
              tool={tool}
              onClick={() => setSelectedTool(tool)}
              onTryNow={() => handleTryNow(tool)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhuma ferramenta encontrada</h3>
          <p className="text-gray-500 mb-4">Tente ajustar os filtros ou termos de busca.</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedStatus('all');
            }}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}